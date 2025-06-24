import styles from '../../styles/skeletons/recipe_details_skeleton.module.scss';
import SummarySkeleton from './summary_skeleton';

function RecipeDetailsSkeleton() {
	return (
		<div className={styles.container}>
			<div className={styles.skeleton_container}>
				<div className={styles.title_container}>
					<div className={styles.title_top}></div>
					<div className={styles.title_bottom}></div>
				</div>

				<div className={styles.stars_and_time}>
					<span className={styles.stars}></span>
					<span className={styles.time}></span>
				</div>

				<SummarySkeleton />

				<div className={styles.save_btn}></div>

				<div className={styles.meal_pic}></div>

				<div className={styles.ingredient_container}>
					<div className={styles.ingredient_header}></div>
					<div className={styles.servings}></div>
					<div className={styles.ingredient_list}>
						{Array.from({ length: 10 }).map((_, index) => (
							<div key={index} className={styles.ingredient}></div>
						))}
					</div>
				</div>

				<div className={styles.instruction_container}>
					<div className={styles.instruction_header}></div>
					<div className={styles.instruction_list}>
						{Array.from({ length: 10 }).map((_, index) => (
							<div key={index} className={styles.instruction}>
								<div className={styles.line_one}></div>
								<div className={styles.line_two}></div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}

export default RecipeDetailsSkeleton;
