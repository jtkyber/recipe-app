import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import axios from 'axios';
import parse from 'html-react-parser';
import { useState, type ChangeEventHandler } from 'react';
import testRecipe from '../../test_recipe.json';
import Stars from '../components/stars';
import styles from '../styles/recipe.module.scss';
import type { IExtendedIngredientsItem, IRecipe } from '../types/recipe';

export const Route = createFileRoute('/recipe/$id')({
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
	// const res = await axios.get('http://localhost:3000/getRecipeInformation?', {
	// 	params: {
	// 		id: 635675,
	// 	},
	// });
	// const data = await res.data;
	// return data;
	const recipe: IRecipe = testRecipe;
	clean_recipe(recipe);
	return recipe;
}

function RouteComponent() {
	const recipe = useLoaderData({ from: Route.id });
	const starRating = Math.round((recipe.spoonacularScore / 20) * 2) / 2;

	const [servingSize, setServingSize] = useState<number>(recipe.servings);

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

	const get_cleaned_instruction = (value: string) => value.replace(/\.([^\s])/g, '. $1');

	return (
		<div className={styles.container}>
			<div className={styles.recipe_container}>
				<h1 className={styles.title}>{recipe.title}</h1>

				<Stars starRating={starRating} />

				<p className={styles.summary}>{parse(recipe.summary)}</p>

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

						return (
							<div className={styles.instruction_group}>
								{name ? <h3 className={styles.instruction_group_name}>{name}</h3> : null}
								<ol className={styles.instruction_group_list}>
									{instruction.steps.map(instructionStep => {
										const { step } = instructionStep;
										const cleanedStep = get_cleaned_instruction(step);

										return <li className={styles.instruction_step}>{cleanedStep}</li>;
									})}
								</ol>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
