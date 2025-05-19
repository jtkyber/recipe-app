import { useEffect } from 'react';
import recipes from '../../recipe_temp.json';
import styles from '../styles/search_result_container.module.scss';
import SearchResult from './search_result';

function SearchResultContainer() {
	useEffect(() => {
		console.log(recipes);
	}, []);

	return (
		<div className={styles.container}>
			<div className={styles.results}>
				{recipes.results.map((recipe: any) => {
					return <SearchResult key={recipe.id} recipe={recipe} />;
				})}
			</div>
		</div>
	);
}

export default SearchResultContainer;
