import { useRouter } from '@tanstack/react-router';
import styles from '../../styles/search_results/search_result.module.scss';
import type { IRecipe } from '../../types/recipe';
import Stars from '../stars';
import ClockSVG from '../svg/clock';

function SearchResult({ recipe }: { recipe: IRecipe | null }) {
	const router = useRouter();

	const { title, image, spoonacularScore, readyInMinutes, id } = recipe || {
		title: '',
		image: '',
		spoonacularScore: 0,
		readyInMinutes: 0,
	};
	const starRating = Math.round((spoonacularScore / 20) * 2) / 2;

	const handle_recipe_click = () => {
		const idString = id?.toString();
		if (!idString) return;

		router.navigate({
			to: `/recipes/$id`,
			params: { id: idString },
		});
	};

	return (
		<div onClick={handle_recipe_click} className={styles.container}>
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
