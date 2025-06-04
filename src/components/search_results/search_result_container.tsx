import { useQuery } from '@tanstack/react-query';
import styles from '../../styles/search_results/search_result_container.module.scss';
import type { IRecipe, ISearchResult } from '../../types/recipe';
import RecipeResultSkeleton from './recipe_result_skeleton';
import SearchResult from './search_result';

function SearchResultContainer() {
	const { data, fetchStatus } = useQuery<ISearchResult, Error>({
		queryKey: ['recipes'],
		queryFn: () => {
			throw new Error('This queryFn should not be called');
		},
		enabled: false,
	});

	return (
		<div className={styles.container}>
			<div className={styles.options}></div>
			<div className={styles.results}>
				{fetchStatus === 'idle'
					? data?.results.map((recipe: IRecipe) => {
							return <SearchResult key={recipe.id} recipe={recipe} />;
						})
					: Array.from({ length: 10 }, (_, index) => <RecipeResultSkeleton key={index} />)}
			</div>
		</div>
	);
}

export default SearchResultContainer;
