import styles from '../styles/nutrition_label_item.module.scss';
import type { INutrient } from '../types/recipe';

function NutritionLabelItem({
	name,
	nutrient,
	servingMult,
	indented,
	bold,
}: {
	name?: string;
	nutrient?: INutrient;
	servingMult: number;
	indented?: boolean;
	bold?: boolean;
}) {
	return (
		<div className={`${styles.container} ${indented ? styles.indented : null}`}>
			<span className={styles.left}>
				<h4 className={`${styles.name} ${bold ? styles.bold : null}`}>
					{name ?? nutrient?.name ?? '*******'}
				</h4>
				<h4 className={styles.amount}>
					{nutrient?.amount !== undefined ? (nutrient.amount * servingMult).toFixed(1) : '***'}
				</h4>
				<h4 className={styles.unit}>{nutrient?.unit ?? '**'}</h4>
			</span>

			<span className={styles.right}>
				<h4 className={styles.dv}>
					{nutrient?.percentOfDailyNeeds !== undefined
						? (nutrient.percentOfDailyNeeds * servingMult).toFixed()
						: '**'}
					%
				</h4>
			</span>
		</div>
	);
}

export default NutritionLabelItem;
