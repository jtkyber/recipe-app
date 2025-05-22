import { useQuery } from '@tanstack/react-query';
import styles from '../styles/search_result_container.module.scss';
import type { ISearchResult } from '../types/recipe';
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
			<div className={styles.results}>
				{fetchStatus === 'idle' ? (
					data?.results.map((recipe: any) => {
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
