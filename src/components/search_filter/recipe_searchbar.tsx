import { useQuery } from '@tanstack/react-query';
import { type ChangeEvent } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setQuery } from '../../redux/slices/searchFilterSlice';
import styles from '../../styles/search_filter/recipe_searchbar.module.scss';

function RecipeSearchbar() {
	const filters = useAppSelector(state => state.searchFilter);
	const dispatch = useAppDispatch();

	const get_recipes = async () => {
		const res = await fetch(
			'https://api.spoonacular.com/recipes/complexSearch?' +
				new URLSearchParams({
					query: filters.query,
					cuisine: filters.cuisine.join(','),
					includeIngredients: filters.ingredients.join(','),
					type: filters.type.join(','),
					instructionsRequired: filters.instructionsRequired.toString(),
					maxReadyTime: filters.maxReadyTime.toString(),
				}),
			{
				headers: {
					'x-api-key': import.meta.env.VITE_SPOONACULAR_API_KEY,
				},
			}
		);
		if (!res.ok) throw new Error('Unable to fetch recipes');
		const data = await res.json();
		return data;
	};

	const { refetch } = useQuery({
		queryKey: ['recipes'],
		queryFn: get_recipes,
		enabled: false,
	});

	const handle_search_input: (e: ChangeEvent) => void = e => {
		const target = e.target as HTMLInputElement;
		dispatch(setQuery(target.value));
	};

	return (
		<div className={styles.container}>
			<input
				onChange={handle_search_input}
				className={styles.search_input}
				type='text'
				placeholder='Search recipes...'
			/>
			<button onClick={() => refetch()} className={styles.search_button}>
				&#x2192;
			</button>
		</div>
	);
}

export default RecipeSearchbar;
