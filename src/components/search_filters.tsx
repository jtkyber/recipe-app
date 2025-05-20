import styles from '../styles/search_filters.module.scss';
import Dropdown from './dropdown';
import RecipeSearchbar from './recipe_searchbar';

function SearchFilters() {
	return (
		<div className={styles.container}>
			<div className={styles.searchbarContainer}>
				<RecipeSearchbar />
			</div>
			<div className={styles.filterContainer}>
				<div className={styles.filters}>
					<Dropdown options={['Chinese', 'German', 'Greek', 'Cajun']} inputType='checkbox' />
					<Dropdown options={['Chinese', 'German', 'Greek', 'Cajun']} inputType='checkbox' />
					<Dropdown options={['Chinese', 'German', 'Greek', 'Cajun']} inputType='checkbox' />
				</div>
			</div>
			<div className={styles.border}></div>
		</div>
	);
}

export default SearchFilters;
