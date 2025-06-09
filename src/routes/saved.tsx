import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { useEffect, useRef, useState } from 'react';
import SearchResult from '../components/search_results/search_result';
import { db } from '../db';
import { useAppSelector } from '../redux/hooks';
import styles from '../styles/saved.module.scss';
import type { IRecipe } from '../types/recipe';

export const Route = createFileRoute('/saved')({
	component: RouteComponent,
});

function RouteComponent() {
	const user = useAppSelector(state => state.user);

	const [recipes, setRecipes] = useState<IRecipe[]>();

	const hasRun = useRef<boolean>(false);

	useEffect(() => {
		if (hasRun.current) return;
		get_saved_recipes();
		hasRun.current = true;
	}, []);

	const fetch_recipes_not_in_indexedDB = async (ids: number[]): Promise<IRecipe[]> => {
		const res = await axios.get(`${import.meta.env.VITE_API_BASE}/getRecipeInformationBulk`, {
			params: {
				ids: ids.join(','),
			},
		});

		const data: IRecipe[] = await res.data;

		return data;
	};

	const save_recipes_to_indexedDB = (recipes: IRecipe[]) => db.savedRecipes.bulkAdd(recipes);

	async function get_saved_recipes(): Promise<void> {
		const savedRecipes = await db.savedRecipes.toArray();

		const iDBSavedRecipeIDs = savedRecipes.map(r => r.id);
		const recipeIDsNotFound = user.savedRecipes.filter(id => !iDBSavedRecipeIDs.includes(id));

		if (recipeIDsNotFound.length) {
			let fetchedRecipes = await fetch_recipes_not_in_indexedDB(recipeIDsNotFound);
			fetchedRecipes = fetchedRecipes || [];

			await save_recipes_to_indexedDB(fetchedRecipes);

			savedRecipes.push(...fetchedRecipes);
		}

		setRecipes(savedRecipes);
	}

	return (
		<div className={styles.scrollable_container}>
			<div className={styles.container}>
				<h1 className={styles.heading_text}>Favorites</h1>
				<div className={styles.saved_recipe_container}>
					{recipes?.map(recipe => {
						return <SearchResult key={recipe.id} recipe={recipe} />;
					})}
				</div>
			</div>
		</div>
	);
}
