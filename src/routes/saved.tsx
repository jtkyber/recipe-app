import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import axios from 'axios';
import type { JSX } from 'react';
import SearchResult from '../components/search_results/search_result';
import RecipeResultSkeleton from '../components/skeletons/recipe_result_skeleton';
import { db } from '../db';
import styles from '../styles/saved.module.scss';
import type { IRecipe } from '../types/recipe';
import type { IUser } from '../types/user';

export const Route = createFileRoute('/saved')({
	loader: ({ context }) => get_saved_recipes(context.getUserData()),
	component: RouteComponentLoaded,
	pendingComponent: RouteComponentPending,
	pendingMs: 0,
});

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

async function get_saved_recipes(user: IUser): Promise<IRecipe[]> {
	const savedRecipes = await db.savedRecipes.toArray();

	const iDBSavedRecipeIDs = savedRecipes.map(r => r.id);
	const recipeIDsNotFound = user.savedRecipes.filter(id => !iDBSavedRecipeIDs.includes(id));

	if (recipeIDsNotFound.length) {
		let fetchedRecipes = await fetch_recipes_not_in_indexedDB(recipeIDsNotFound);
		fetchedRecipes = fetchedRecipes || [];

		await save_recipes_to_indexedDB(fetchedRecipes);

		savedRecipes.push(...fetchedRecipes);
	}

	return savedRecipes;
}

const SavedComponentLayout = ({ children }: { children: JSX.Element[] }) => {
	return (
		<div className={styles.scrollable_container}>
			<div className={styles.container}>
				<h1 className={styles.heading_text}>Favorites</h1>
				<div className={styles.saved_recipe_container}>{children}</div>
			</div>
		</div>
	);
};

function RouteComponentLoaded() {
	const recipes = useLoaderData({ from: '/saved' });

	return (
		<SavedComponentLayout>
			{recipes?.map(recipe => {
				return <SearchResult key={recipe.id} recipe={recipe} />;
			})}
		</SavedComponentLayout>
	);
}

function RouteComponentPending() {
	return (
		<SavedComponentLayout>
			{Array.from({ length: 5 }).map((_, index) => (
				<RecipeResultSkeleton key={index} />
			))}
		</SavedComponentLayout>
	);
}
