import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
	addCuisine,
	addIngredient,
	addType,
	removeCuisine,
	removeIngredient,
	removeType,
	type FilterProperties,
} from '../../redux/slices/searchFilterSlice';
import styles from '../../styles/search_filter/search_filters.module.scss';
import type { InputType } from '../../types/dropdown';
import Dropdown from './dropdown';
import FilterOption from './filter_option';
import RecipeSearchbar from './recipe_searchbar';

function SearchFilters() {
	const filters = useAppSelector(state => state.searchFilter);
	const dispatch = useAppDispatch();

	const handle_input: (e: React.MouseEvent<Element, MouseEvent>, inputType: InputType) => void = (
		e,
		inputType
	) => {
		const target = e.target as HTMLDivElement;
		switch (inputType) {
			case 'checkbox':
				toggle_checkbox(target);
				break;
		}
	};

	const toggle_checkbox = (selectedOption: HTMLDivElement) => {
		// const input = selectedOption.querySelector('#checkbox') as HTMLDivElement;
		// input.dataset.checked = input.dataset.checked === 'true' ? 'false' : 'true';

		const filterName = selectedOption.dataset.filter?.toLowerCase() as FilterProperties;
		const label = selectedOption.id.toLowerCase();

		switch (filterName) {
			case 'cuisine':
				if (filters[filterName].includes(label)) {
					dispatch(removeCuisine(label));
				} else dispatch(addCuisine(label));
				break;
			case 'ingredients':
				if (filters[filterName].includes(label)) {
					dispatch(removeIngredient(label));
				} else dispatch(addIngredient(label));
				break;
			case 'type':
				if (filters[filterName].includes(label)) {
					dispatch(removeType(label));
				} else dispatch(addType(label));
				break;
		}
	};

	// const select_radio = (selectedOption: HTMLDivElement) => {
	// 	const allOptions = optionsRef.current?.children;
	// 	if (!allOptions) return;
	// 	for (const option of allOptions) {
	// 		const input = option.querySelector('#radio') as HTMLDivElement;
	// 		if (option === selectedOption) input.dataset.checked = 'true';
	// 		else input.dataset.checked = 'false';
	// 	}
	// };

	return (
		<div className={styles.container}>
			<div className={styles.searchbarContainer}>
				<RecipeSearchbar />
			</div>
			<div className={styles.filterContainer}>
				<div className={styles.filters}>
					<Dropdown
						filterName='cuisine'
						options={['Chinese', 'German', 'Greek', 'Cajun']}
						inputType='checkbox'
						handle_input={handle_input}>
						Cuisine
					</Dropdown>
					<Dropdown
						filterName='ingredients'
						options={['Chicken', 'lettuce']}
						inputType='checkbox'
						handle_input={handle_input}>
						Ingredients
					</Dropdown>
					<Dropdown
						filterName='type'
						options={['Dinner', 'Lunch', 'Drink']}
						inputType='checkbox'
						handle_input={handle_input}>
						Meal Type
					</Dropdown>
					<FilterOption
						name='Instructions Required'
						filter='instructionsRequired'
						inputType='checkbox'
						handle_input={handle_input}>
						Instructions Required
					</FilterOption>
					<FilterOption
						name='Max Ready Time'
						filter='maxReadyTime'
						inputType='number'
						handle_input={handle_input}
						inputAttributes={{ min: 0 }}>
						<>
							Max Ready Time<span style={{ fontWeight: 200, fontSize: '0.9em' }}>(mins)</span>
						</>
					</FilterOption>
				</div>
			</div>
			<div className={styles.border}></div>
		</div>
	);
}

export default SearchFilters;
