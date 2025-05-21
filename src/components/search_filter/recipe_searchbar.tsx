import styles from '../../styles/search_filter/recipe_searchbar.module.scss';

function RecipeSearchbar() {
	return (
		<div className={styles.container}>
			<input className={styles.search_input} type='text' placeholder='Search recipes...' />
			<button className={styles.search_button_test}>&#x2192;</button>
		</div>
	);
}

export default RecipeSearchbar;
