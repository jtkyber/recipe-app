import styles from '../styles/stars.module.scss';
import StarSVG from './svg/starSVG';

function Stars({ starRating }: { starRating: number }) {
	return (
		<div className={styles.container}>
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
	);
}

export default Stars;
