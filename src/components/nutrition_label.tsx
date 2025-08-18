import { useEffect, useState } from 'react';
import styles from '../styles/nutrition_label.module.scss';
import type { INutrient } from '../types/recipe';
import NutritionLabelItem from './nutrition_label_item';

interface IOrganizedNutrients {
	calories: INutrient | undefined;
	fat: {
		totalFat: INutrient | undefined;
		saturatedFat: INutrient | undefined;
		transFat?: INutrient | undefined;
	};
	cholesterol: INutrient | undefined;
	sodium: INutrient | undefined;
	carbs: {
		totalCarbs: INutrient | undefined;
		dietaryFiber: INutrient | undefined;
		totalSugars: INutrient | undefined;
	};
	protein: INutrient | undefined;
	vitsAndMins: INutrient[];
}

function NutritionLabel({
	nutrients,
	caloricBreakdown,
	servingMult,
}: {
	nutrients: INutrient[];
	caloricBreakdown: {
		percentCarbs: number;
		percentFat: number;
		percentProtein: number;
	};
	servingMult: number;
}) {
	const [organizeNutrients, setOrganizedNutrients] = useState<IOrganizedNutrients>();
	const computedStyle = window.getComputedStyle(document.body);
	const proteinColor = computedStyle.getPropertyValue('--color-protein');
	const fatsColor = computedStyle.getPropertyValue('--color-fats');
	const carbsColor = computedStyle.getPropertyValue('--color-carbs');

	const generate_organized_nutrients = () => {
		const organized: IOrganizedNutrients = {
			calories: undefined,
			fat: {
				totalFat: undefined,
				saturatedFat: undefined,
			},
			cholesterol: undefined,
			sodium: undefined,
			carbs: {
				totalCarbs: undefined,
				dietaryFiber: undefined,
				totalSugars: undefined,
			},
			protein: undefined,
			vitsAndMins: [],
		};

		loop: for (const n of nutrients) {
			if (['alcohol', 'alcohol %', 'net carbohydrates'].includes(n.name.toLowerCase())) {
				continue loop;
			}

			switch (n.name.toLowerCase()) {
				case 'calories':
					organized.calories = n;
					continue loop;
				case 'fat':
					organized.fat.totalFat = n;
					continue loop;
				case 'saturated fat':
					organized.fat.saturatedFat = n;
					continue loop;
				case 'cholesterol':
					organized.cholesterol = n;
					continue loop;
				case 'sodium':
					organized.sodium = n;
					continue loop;
				case 'carbohydrates':
					organized.carbs.totalCarbs = n;
					continue loop;
				case 'fiber':
					organized.carbs.dietaryFiber = n;
					continue loop;
				case 'sugar':
					organized.carbs.totalSugars = n;
					continue loop;
				case 'protein':
					organized.protein = n;
					continue loop;
			}

			organized.vitsAndMins.push(n);
		}

		organized.vitsAndMins.sort((a, b) => b.percentOfDailyNeeds - a.percentOfDailyNeeds);

		setOrganizedNutrients(organized);
	};

	useEffect(generate_organized_nutrients, []);

	return (
		<div className={styles.container}>
			<div className={styles.nutrition_container}>
				<div className={styles.title_container}>
					<h2 className={styles.title}>Nutrition Facts</h2>
				</div>
				<div className={styles.serving_container}></div>
				<div className={styles.calories_container}>
					<h4 className={styles.amt_per_serving_text}>Amount Per Serving</h4>
					<div className={styles.calorie_amt_container}>
						<h2 className={styles.calories_text}>Calories</h2>
						<h2 className={styles.calorie_amt_text}>{Math.round(nutrients[0].amount * servingMult)}</h2>
					</div>
				</div>
				<div className={styles.macros_container}>
					<div className={styles.daily_value_label}>
						<h5 className={styles.daily_value_text}>% Daily Value *</h5>
					</div>
					<div className={styles.fat_container}>
						<NutritionLabelItem
							nutrient={organizeNutrients?.fat.totalFat}
							servingMult={servingMult}
							name='Total Fat'
							bold
						/>
						<NutritionLabelItem
							nutrient={organizeNutrients?.fat.saturatedFat}
							servingMult={servingMult}
							indented
						/>

						<NutritionLabelItem nutrient={organizeNutrients?.cholesterol} servingMult={servingMult} bold />

						<NutritionLabelItem nutrient={organizeNutrients?.sodium} servingMult={servingMult} bold />

						<NutritionLabelItem
							nutrient={organizeNutrients?.carbs.totalCarbs}
							servingMult={servingMult}
							name='Total Carbohydrate'
							bold
						/>
						<NutritionLabelItem
							nutrient={organizeNutrients?.carbs.dietaryFiber}
							servingMult={servingMult}
							name='Dietary Fiber'
							indented
						/>
						<NutritionLabelItem
							nutrient={organizeNutrients?.carbs.totalSugars}
							servingMult={servingMult}
							name='Total Sugars'
							indented
						/>

						<NutritionLabelItem nutrient={organizeNutrients?.protein} servingMult={servingMult} bold />
					</div>
				</div>
				<div className={styles.micros_container}>
					{organizeNutrients?.vitsAndMins.map(n => (
						<NutritionLabelItem nutrient={n} servingMult={servingMult} key={n.name} />
					))}
				</div>
				<div className={styles.caloric_breakdown}>
					<div
						className={styles.bar_chart}
						style={{
							background: `linear-gradient(to right, ${proteinColor} 0%, ${proteinColor} ${caloricBreakdown.percentProtein}%, ${fatsColor} ${caloricBreakdown.percentProtein}%, ${fatsColor} ${caloricBreakdown.percentFat + caloricBreakdown.percentProtein}%, ${carbsColor} ${caloricBreakdown.percentFat + caloricBreakdown.percentProtein}%)`,
						}}></div>
					<div className={styles.caloric_categories}>
						<h5 className={styles.protein} style={{ color: proteinColor }}>
							Protein
						</h5>
						<h5 className={styles.fats} style={{ color: fatsColor }}>
							Fats
						</h5>
						<h5 className={styles.carbs} style={{ color: carbsColor }}>
							Carbs
						</h5>
					</div>
				</div>
			</div>
		</div>
	);
}

export default NutritionLabel;
