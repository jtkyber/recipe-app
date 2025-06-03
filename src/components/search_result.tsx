import styles from '../styles/search_result.module.scss';
import type { IRecipe } from '../types/recipe';
import ClockSVG from './svg/clock';
import StarSVG from './svg/starSVG';

function SearchResult({ recipe }: { recipe: IRecipe }) {
	const { title, image, spoonacularScore, readyInMinutes } = recipe;
	const starRating = Math.round((spoonacularScore / 20) * 2) / 2;

	return (
		<div className={styles.container}>
			<h3 className={styles.title}>{title}</h3>
			<img className={styles.meal_image} src={image} alt='Meal Image' />
			<div className={styles.bottomSection}>
				<div className={styles.stars}>
					{Array.from({ length: 5 }, (_, index) => {
						const currentStarFillAmt = Math.min(Math.max(starRating - index, 0), 1);
						return (
							<span
								key={index}
								className={`${styles.star} ${currentStarFillAmt === 0 ? styles.empty : null} ${currentStarFillAmt === 0.5 ? styles.half : null}`}>
								<StarSVG />
							</span>
						);
					})}
				</div>
				<div className={styles.timeToReadyContainer}>
					<ClockSVG />
					<span className={styles.timeToReady}>{readyInMinutes}mins</span>
				</div>
			</div>
		</div>
	);
}

export default SearchResult;
