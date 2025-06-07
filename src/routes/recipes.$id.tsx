import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import axios from 'axios';
import { useEffect, useRef, useState, type ChangeEventHandler } from 'react';
import Stars from '../components/stars';
import ClockSVG from '../components/svg/clock';
import styles from '../styles/recipe.module.scss';
import type { IExtendedIngredientsItem, IRecipe, IRecipeInstructionStep } from '../types/recipe';

export const Route = createFileRoute('/recipes/$id')({
	loader: ({ params }) => fetch_recipe(params.id),
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

async function fetch_recipe(id: string): Promise<IRecipe> {
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
}

function RouteComponent() {
	const recipe = useLoaderData({ from: Route.id });

	const starRating = Math.round((recipe.spoonacularScore / 20) * 2) / 2;

	const [servingSize, setServingSize] = useState<number>(recipe.servings);
	const [shortSummary, setShortSummary] = useState<string>('');

	const hasRun = useRef<boolean>(false);

	useEffect(() => {
		if (hasRun.current) return;
		fetch_summary();
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

	return (
		<div className={styles.bg_container}>
			{/* <img className={styles.background_img} src={recipe.image} alt='Recipe Background Image' /> */}
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
