import { createRef, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
	addCuisine,
	addIngredient,
	addType,
	removeCuisine,
	removeIngredient,
	removeType,
	setMaxReadyTime,
	toggleInstructionsRequired,
	type FilterProperty,
} from '../../redux/slices/searchFilterSlice';
import styles from '../../styles/search_filter/search_filters.module.scss';
import type { InputType } from '../../types/dropdown';
import { cuisineValues, mealTypeValues } from '../../utils/filter_values';
import Dropdown from './dropdown';
import FilterOption from './filter_option';
import RecipeSearchbar from './recipe_searchbar';

function SearchFilters() {
	const filters = useAppSelector(state => state.searchFilter);
	const dispatch = useAppDispatch();
	const filtersDivRef = createRef<HTMLDivElement>();

	useEffect(set_textboxes, []);
	useEffect(set_checkboxes, [filters]);

	function set_textboxes() {
		const filterKeys = Object.keys(filters) as FilterProperty[];
		for (const key of filterKeys) {
			if (key === 'maxReadyTime') {
				const allOptions = filtersDivRef.current?.querySelectorAll(
					`[data-filter=${key}]`
				) as NodeListOf<HTMLDivElement>;

				for (const option of allOptions) {
					const input = option.querySelector('#number') as HTMLInputElement;
					input.value = filters[key].toString();
				}
			}
		}
	}

	function set_checkboxes() {
		const set_values = (key: FilterProperty) => {
			const allOptions = filtersDivRef.current?.querySelectorAll(
				`[data-filter=${key}]`
			) as NodeListOf<HTMLDivElement>;

			for (const option of allOptions) {
				const input = option.querySelector('#checkbox') as HTMLDivElement;
				if (!option.dataset.filter) continue;

				if (Array.isArray(filters[key])) {
					input.dataset.checked = filters[key].includes(option.id).toString();
				} else {
					input.dataset.checked = filters[key].toString();
				}
			}
		};

		const filterKeys = Object.keys(filters) as FilterProperty[];
		for (const key of filterKeys) {
			if (['cuisine', 'ingredients', 'type', 'instructionsRequired'].includes(key)) {
				set_values(key);
			}
		}
	}

	const handle_input: (e: React.FormEvent<HTMLDivElement>, inputType: InputType) => void = (e, inputType) => {
		const target = e.target as HTMLDivElement & HTMLInputElement;

		switch (inputType) {
			case 'checkbox':
				toggle_checkbox(target);
				break;
			case 'number':
				set_number(target);
				break;
		}
	};

	const toggle_checkbox = (selectedOption: HTMLDivElement) => {
		const filterName = selectedOption.dataset.filter as FilterProperty;
		const label = selectedOption.id;

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
			case 'instructionsRequired':
				dispatch(toggleInstructionsRequired());
				break;
		}
	};

	const set_number = (input: HTMLInputElement) => {
		const option = input.parentElement as HTMLDivElement;
		const filterName = option.dataset.filter as FilterProperty;
		const value = parseInt(input.value);

		switch (filterName) {
			case 'maxReadyTime':
				dispatch(setMaxReadyTime(value));
				break;
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.searchbarContainer}>
				<RecipeSearchbar />
			</div>
			<div className={styles.filterContainer}>
				<div ref={filtersDivRef} className={styles.filters}>
					<Dropdown
						filterName='cuisine'
						options={cuisineValues}
						inputType='checkbox'
						handle_input={handle_input}
						set_checkboxes={set_checkboxes}>
						Cuisine
					</Dropdown>
					<Dropdown
						filterName='ingredients'
						options={['Chicken', 'lettuce']}
						inputType='checkbox'
						handle_input={handle_input}
						set_checkboxes={set_checkboxes}>
						Ingredients
					</Dropdown>
					<Dropdown
						filterName='type'
						options={mealTypeValues}
						inputType='checkbox'
						handle_input={handle_input}
						set_checkboxes={set_checkboxes}>
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
