import parse from 'html-react-parser';
import { useAppSelector } from '../redux/hooks';
import styles from '../styles/search_result.module.scss';
import type { IRecipe } from '../types/recipe';

function SearchResult({ recipe }: { recipe: IRecipe }) {
	const { title, image, summary } = recipe;
	console.log(recipe);
	const view = useAppSelector(state => state.resultsOptions.view);

	const isGridView = view === 'grid';

	return (
		<div className={`${styles.container} ${isGridView ? styles.gridView : null}`}>
			<h4 className={styles.title}>{title}</h4>
			<p className={styles.summary}>{parse(summary)}</p>
			<img className={styles.meal_image} src={image} alt='Meal Image' />
		</div>
	);
}

export default SearchResult;
