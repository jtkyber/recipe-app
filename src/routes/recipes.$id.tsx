import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import axios from 'axios';
import { useEffect, useRef, useState, type ChangeEventHandler } from 'react';
import Stars from '../components/stars';
import ClockSVG from '../components/svg/clock';
import HeartSVG from '../components/svg/heart';
import { db } from '../db';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setSavedRecipes } from '../redux/slices/userSlice';
import styles from '../styles/recipe.module.scss';
import type { IExtendedIngredientsItem, IRecipe, IRecipeInstructionStep } from '../types/recipe';

export const Route = createFileRoute('/recipes/$id')({
	loader: ({ params }) => get_recipe(params.id),
	component: RouteComponent,
});

const clean_recipe = (recipe: IRecipe) => {
	const newIngredients = recipe.extendedIngredients.reduce(
		(acc: IExtendedIngredientsItem[], item: IExtendedIngredientsItem) => {
			for (const ing of acc) {
				if (ing.originalName === item.originalName) return acc;
			}
			acc.push(item);
			return acc;
		},
		[]
	);

	recipe.extendedIngredients = newIngredients;
};

const get_recipe_from_indexedDB = async (id: string): Promise<IRecipe | null> => {
	const recipe = await db.savedRecipes.get(parseInt(id));

	if (!recipe?.id) return null;

	clean_recipe(recipe);

	return recipe;
};

const fetch_recipe = async (id: string): Promise<IRecipe> => {
	// 715415
	// 655668
	const res = await axios.get('http://localhost:3000/getRecipeInformation?', {
		params: {
			id: id,
		},
	});
	const data = await res.data;
	clean_recipe(data);
	return data;
};

async function get_recipe(id: string): Promise<IRecipe> {
	const recipe = await get_recipe_from_indexedDB(id);

	if (recipe?.id) return recipe;

	return await fetch_recipe(id);
}

function RouteComponent() {
	const recipe = useLoaderData({ from: Route.id });

	const starRating = Math.round((recipe.spoonacularScore / 20) * 2) / 2;

	const user = useAppSelector(state => state.user);
	const dispatch = useAppDispatch();
	const [servingSize, setServingSize] = useState<number>(recipe.servings);
	const [shortSummary, setShortSummary] = useState<string>('');

	const hasRun = useRef<boolean>(false);

	useEffect(() => {
		if (hasRun.current) return;

		if (recipe?.shortSummary) setShortSummary(recipe.shortSummary);
		else fetch_summary();
		hasRun.current = true;
	}, []);

	const handle_servings_change: ChangeEventHandler<HTMLInputElement> = e => {
		const target = e.target;
		const value = target.value;
		const lastValue = value.substring(0, value.length - 1);

		const isNumber = /^\d+$/;
		if (value === '') setServingSize(recipe.servings);
		else if (!isNumber.exec(value) || parseInt(value) > 999 || parseInt(value) === 0) {
			target.value = lastValue;
			return;
		} else {
			setServingSize(parseInt(value));
		}
	};

	const get_cleaned_text = (value: string) => value.replace(/\.([^\s])/g, '. $1');

	async function fetch_summary(): Promise<void> {
		const res = await axios.get('http://localhost:3000/getRecipeSummary?', {
			params: {
				summary: recipe.summary,
			},
		});
		const data = await res.data;
		setShortSummary(data);
	}

	const recipeSaved = user.savedRecipes?.includes(recipe.id);

	const toggle_save_recipe_id_to_db = async (): Promise<
		| {
				payload: number[];
				wasAdded: boolean;
		  }
		| undefined
	> => {
		try {
			const res = await axios.put(`${import.meta.env.VITE_API_BASE}/toggleSaveRecipe`, {
				id: user.id,
				recipeId: recipe.id,
			});

			const data = await res.data;
			if (data.err) throw new Error('Unable to save or remove recipe');
			return data;
		} catch (err) {
			console.log(err);
		}
	};

	const toggle_save_recipe_to_indexedDB = async (wasAdded: boolean): Promise<number | null> => {
		if (wasAdded) {
			recipe.shortSummary = shortSummary;
			return await db.savedRecipes.add(recipe);
		} else {
			await db.savedRecipes.delete(recipe.id);
			return null;
		}
	};

	const toggle_save_recipe = async () => {
		const savedRecipeIDs = await toggle_save_recipe_id_to_db();
		if (savedRecipeIDs === undefined) return;

		await toggle_save_recipe_to_indexedDB(savedRecipeIDs.wasAdded);

		dispatch(setSavedRecipes(savedRecipeIDs.payload));
	};

	return (
		<div className={styles.bg_container}>
			<div className={styles.container}>
				<div className={styles.recipe_container}>
					<h1 className={styles.title}>{recipe.title}</h1>

					<div className={styles.star_time_container}>
						<Stars starRating={starRating} />
						<div className={styles.timeToReadyContainer}>
							<ClockSVG />
							<span className={styles.timeToReady}>{recipe.readyInMinutes}mins</span>
						</div>
					</div>

					{shortSummary.length ? (
						<p className={styles.summary}>{shortSummary}</p>
					) : (
						<div className={styles.summary_skeleton}>
							<div className={styles.piece}></div>
							<div className={styles.piece}></div>
							<div className={`${styles.piece} ${styles.center_piece}`}>
								<span></span>
								<h5 className={styles.skeleton_text}>Generating Summary</h5>
								<span></span>
							</div>
							<div className={styles.piece}></div>
							<div className={styles.piece}></div>
						</div>
					)}

					<div className={styles.save_container}>
						<button
							onClick={toggle_save_recipe}
							className={`${styles.save_button} ${recipeSaved ? styles.is_saved : null}`}>
							<h3 className={styles.save_text}>{recipeSaved ? 'Saved' : 'Save'}</h3>
							<HeartSVG />
						</button>
					</div>

					<div className={styles.image_container}>
						<img className={styles.image} src={recipe.image} alt='Recipe Image' />
					</div>

					<div className={styles.ingredient_container}>
						<h2 className={styles.ingredients_text}>Ingredients</h2>
						<div className={styles.serving_container}>
							<label htmlFor='servings'>Servings:</label>
							<input
								onChange={handle_servings_change}
								id='servings'
								type='text'
								placeholder={recipe.servings.toString()}
							/>
						</div>
						<ul className={styles.ingredient_list}>
							{recipe.extendedIngredients.map(ingredient => {
								const { originalName, measures } = ingredient;
								const units: 'us' | 'metric' = 'us';
								const { amount, unitLong } = units === 'us' ? measures.us : measures.metric;
								let amountCalc = amount * (servingSize / recipe.servings);
								amountCalc = Math.round(amountCalc * 100) / 100;

								return (
									<li key={originalName} className={styles.ingredient_item}>
										<span className={styles.amount}>{amountCalc} </span>
										<span className={styles.unit}>{unitLong} </span>
										<span className={styles.name}>{originalName}</span>
									</li>
								);
							})}
						</ul>
					</div>

					<div className={styles.instructions_container}>
						<h2 className={styles.instructions_text}>Instructions</h2>
						{recipe.analyzedInstructions.map(instruction => {
							const { name } = instruction;
							const cleanedName = get_cleaned_text(name);

							return (
								<div key={name} className={styles.instruction_group}>
									{name ? <h4 className={styles.instruction_group_name}>{cleanedName}</h4> : null}
									<ol className={styles.instruction_group_list}>
										{instruction.steps.map((instructionStep: IRecipeInstructionStep) => {
											const { step, number } = instructionStep;
											const cleanedStep = get_cleaned_text(step);

											return (
												<li key={number} className={styles.instruction_step}>
													{cleanedStep}
												</li>
											);
										})}
									</ol>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		</div>
	);
}
