import { keepPreviousData, useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setQuery } from '../../redux/slices/searchFilterSlice';
import styles from '../../styles/search_filter/recipe_searchbar.module.scss';
import type { ISearchResult } from '../../types/recipe';

function RecipeSearchbar() {
	const filters = useAppSelector(state => state.searchFilter);
	const user = useAppSelector(state => state.user);
	const dispatch = useAppDispatch();

	const [fetchAllowed, setFetchAllowed] = useState<boolean>(false);

	const inputRef = useRef<HTMLInputElement>(null);

	const get_recipes = async () => {
		const res = await axios.get('http://localhost:3000/getRecipes?', {
			params: {
				searchQuery: filters.query,
				sortOption: 'meta-score',
				diet: user.diet,
				intolerances: user.intolerances.join(','),
				excludedIngredients: user.excludedIngredients.join(','),
				cuisine: filters.cuisine.join(','),
				ingredients: filters.ingredients.join(','),
				mealType: filters.type.join(','),
				instructionsRequired: filters.instructionsRequired.toString(),
				maxReadyTime: filters.maxReadyTime.toString(),
				number: filters.count.toString(),
				page: filters.page.toString(),
			},
		});
		if (!res) throw new Error('Unable to fetch recipes');
		const data = res.data as ISearchResult;

		if (data?.pointsRemaining && data?.pointsSpentThisRequest) {
			console.log(
				`Points remaining: ${data.pointsRemaining} \nPoints spent this request: ${data.pointsSpentThisRequest}`
			);
		} else console.log('Returned cached recipe (node)');
		return data;
	};

	const { fetchStatus } = useQuery({
		queryKey: ['recipes', filters],
		queryFn: get_recipes,
		enabled: fetchAllowed,
		placeholderData: keepPreviousData,
	});

	const handle_search_btn_click = () => {
		if (!inputRef?.current) return;

		dispatch(setQuery(inputRef.current.value));
		setFetchAllowed(true);
	};

	return (
		<div className={styles.container}>
			<input ref={inputRef} className={styles.search_input} type='text' placeholder='Search recipes...' />
			<button
				disabled={fetchStatus !== 'idle'}
				onClick={handle_search_btn_click}
				className={styles.search_button}>
				&#x2192;
			</button>
		</div>
	);
}

export default RecipeSearchbar;
