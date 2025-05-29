import { useQuery } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { toggleView } from '../redux/slices/resultOptionSlice';
import styles from '../styles/search_result_container.module.scss';
import type { IRecipe, ISearchResult } from '../types/recipe';
import SearchResult from './search_result';

function SearchResultContainer() {
	const dispatch = useAppDispatch();
	const view = useAppSelector(state => state.resultsOptions.view);
	const { data, fetchStatus } = useQuery<ISearchResult, Error>({
		queryKey: ['recipes'],
		queryFn: () => {
			throw new Error('This queryFn should not be called');
		},
		enabled: false,
	});

	const handle_view_change = () => dispatch(toggleView());

	const isGridView = view === 'grid';

	return (
		<div className={styles.container}>
			<div onClick={handle_view_change} className={styles.options}>
				<span className={styles.view}>{isGridView ? 'L' : 'G'}</span>
			</div>
			<div className={`${styles.results} ${isGridView ? styles.gridView : null}`}>
				{fetchStatus === 'idle' ? (
					data?.results.map((recipe: IRecipe) => {
						return <SearchResult key={recipe.id} recipe={recipe} />;
					})
				) : (
					<h4>Loading...</h4>
				)}
			</div>
		</div>
	);
}

export default SearchResultContainer;
