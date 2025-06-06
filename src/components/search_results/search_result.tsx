import styles from '../../styles/search_results/search_result.module.scss';
import type { IRecipe } from '../../types/recipe';
import Stars from '../stars';
import ClockSVG from '../svg/clock';

function SearchResult({ recipe }: { recipe: IRecipe | null }) {
	const { title, image, spoonacularScore, readyInMinutes } = recipe || {
		title: '',
		image: '',
		spoonacularScore: 0,
		readyInMinutes: 0,
	};
	const starRating = Math.round((spoonacularScore / 20) * 2) / 2;

	return (
		<div className={styles.container}>
			<h3 className={styles.title}>{title}</h3>
			<img className={styles.meal_image} src={image} alt='Meal Image' />
			<div className={styles.bottomSection}>
				<Stars starRating={starRating} />
				<div className={styles.timeToReadyContainer}>
					<ClockSVG />
					<span className={styles.timeToReady}>{readyInMinutes}mins</span>
				</div>
			</div>
		</div>
	);
}

export default SearchResult;
