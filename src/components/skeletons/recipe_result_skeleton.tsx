import styles from '../../styles/skeletons/recipe_result_skeleton.module.scss';

function RecipeResultSkeleton() {
	return (
		<div className={styles.container}>
			<div className={styles.img}></div>
			<div className={styles.title}></div>
			<div className={styles.bottom_container}>
				<div className={styles.stars}></div>
				<div className={styles.timeToReady}></div>
			</div>
		</div>
	);
}

export default RecipeResultSkeleton;
