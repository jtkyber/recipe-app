import styles from '../../styles/skeletons/summary_skeleton.module.scss';

function SummarySkeleton({ pulse = false }: { pulse?: boolean }) {
	return (
		<div className={`${styles.container} ${pulse ? styles.pulse : null}`}>
			<div className={styles.piece}></div>
			<div className={styles.piece}></div>
			<div className={`${styles.piece} ${styles.center_piece}`}>
				<span></span>
				<h5 className={styles.skeleton_text}>Generating Summary</h5>
				<span></span>
			</div>
			<div className={styles.piece}></div>
			<div className={styles.piece}></div>
		</div>
	);
}

export default SummarySkeleton;
