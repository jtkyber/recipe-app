import styles from '../styles/search_result.module.scss';
import type { IRecipe } from '../types/recipe';

// const createMarkup = (htmlString: string) => {
// 	return { __html: htmlString };
// };

function SearchResult({ recipe }: { recipe: IRecipe }) {
	const { title, image } = recipe;

	return (
		<div className={styles.container}>
			<h4 className={styles.title}>{title}</h4>
			<img className={styles.image} src={image} alt={title} />
			<br />
		</div>
	);
}

export default SearchResult;
