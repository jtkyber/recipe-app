import { createFileRoute, useLoaderData } from '@tanstack/react-router';
import SearchResult from '../components/search_results/search_result';
import { db } from '../db';
import styles from '../styles/saved.module.scss';
import type { IRecipe } from '../types/recipe';

export const Route = createFileRoute('/saved')({
	loader: () => getSavedRecipes(),
	component: RouteComponent,
});

async function getSavedRecipes(): Promise<IRecipe[]> {
	const data = await db.savedRecipes.toArray();
	return data;
}

function RouteComponent() {
	const recipes = useLoaderData({ from: Route.id });

	return (
		<div className={styles.scrollable_container}>
			<div className={styles.container}>
				<h1 className={styles.heading_text}>Favorites</h1>
				<div className={styles.saved_recipe_container}>
					{recipes.map(recipe => {
						return <SearchResult key={recipe.id} recipe={recipe} />;
					})}
				</div>
			</div>
		</div>
	);
}
