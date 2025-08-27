import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { createRef, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import {
	addCuisine,
	addIngredient,
	addType,
	removeCuisine,
	removeIngredient,
	removeType,
	setMaxReadyTime,
	setSortType,
	toggleIgnoreProfileFilters,
	toggleInstructionsRequired,
} from '../../redux/slices/searchFilterSlice';
import optionStyles from '../../styles/search_filter/filter_option.module.scss';
import styles from '../../styles/search_filter/search_filters.module.scss';
import type { InputType } from '../../types/dropdown';
import type { FilterProperty } from '../../types/filters';
import { get_parent_with_class_name } from '../../utils/dom_tools';
import { cuisineValues, mealTypeValues, sortValues } from '../../utils/filter_values';
import AutocompleteDropdown from './autocompleteDropdown';
import Dropdown from './dropdown';
import FilterOption from './filter_option';
import RecipeSearchbar from './recipe_searchbar';

function SearchFilters() {
	const filters = useAppSelector(state => state.searchFilter);
	const dispatch = useAppDispatch();
	const containerRef = createRef<HTMLDivElement>();
	const filtersDivRef = createRef<HTMLDivElement>();

	const [activeTextbox, setActiveTextbox] = useState<HTMLInputElement | null>(null);
	const [autocompleteText, setAutocompleteText] = useState<string>('');

	const debouncedAutocompleteText = useDebouncedCallback((value: any) => {
		setAutocompleteText(value);
	}, 500);

	const debouncedMaxReadyTimeText = useDebouncedCallback((value: any) => {
		dispatch(setMaxReadyTime(parseInt(value)));
	}, 500);

	const { refetch, data: autocompleteOptions } = useQuery({
		queryKey: ['autocomplete'],
		queryFn: get_autocomplete_ingredients,
		enabled: false,
	});

	useEffect(() => {
		const filtersDiv = filtersDivRef.current;
		if (!filtersDiv) return;

		filtersDiv.addEventListener('focusin', handle_focus_in, true);
		filtersDiv.addEventListener('focusout', handle_focus_out, true);

		return () => {
			if (!filtersDiv) return;

			filtersDiv.removeEventListener('focusin', handle_focus_in, true);
			filtersDiv.removeEventListener('focusout', handle_focus_out, true);
		};
	}, []);
	useEffect(set_textboxes, []);
	useEffect(() => {
		refetch();
	}, [autocompleteText]);

	function handle_focus_in(e: Event) {
		const target = e.target;
		if (!(target instanceof HTMLInputElement)) return;
		setActiveTextbox(target);
	}
	function handle_focus_out() {
		setActiveTextbox(null);
		setAutocompleteText('');
	}

	function set_textboxes() {
		const filterKeys = Object.keys(filters) as FilterProperty[];

		for (const key of filterKeys) {
			const allOptions = filtersDivRef.current?.querySelectorAll(
				`[data-filter=${key}]`
			) as NodeListOf<HTMLDivElement>;

			for (const option of allOptions) {
				const inputType = option.dataset.inputType as InputType;
				if (inputType !== 'number' && inputType !== 'text') continue;

				const input = option.querySelector(inputType === 'number' ? '#number' : '#text') as HTMLInputElement;
				input.value = filters[key].toString();
			}
		}
	}

	const handle_input: (e: React.FormEvent<HTMLDivElement>, inputType: InputType) => void = (e, inputType) => {
		const target = e.target as HTMLDivElement & HTMLInputElement;

		switch (inputType) {
			case 'checkbox':
				handle_checkbox(target);
				break;
			case 'radio':
				handle_radio(target);
				break;
			case 'number':
				handle_textbox(target);
				break;
			case 'text':
				handle_textbox(target);
				break;
		}
	};

	const handle_checkbox = (selectedOption: HTMLDivElement) => {
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
			case 'ignoreProfileFilters':
				dispatch(toggleIgnoreProfileFilters());
				break;
		}
	};

	const handle_radio = (selectedOption: HTMLDivElement) => {
		const filterName = selectedOption.dataset.filter as FilterProperty;
		const label = selectedOption.id;

		switch (filterName) {
			case 'sortType':
				dispatch(setSortType(label));
				break;
		}
	};

	async function get_autocomplete_ingredients() {
		if (!autocompleteText.length) return [];

		const res = await axios(`${import.meta.env.VITE_API_BASE}/getRecipeAutocomplete?`, {
			params: {
				text: autocompleteText,
				count: '10',
			},
		});
		if (!res) throw new Error('Unable to fetch ingredients');
		const data = res.data;
		return data;
	}

	const handle_textbox = (input: HTMLInputElement) => {
		const option = get_parent_with_class_name(input, optionStyles.option) as HTMLDivElement;
		const filterName = option.dataset.filter as FilterProperty;
		const value = input.value;

		switch (filterName) {
			case 'maxReadyTime':
				debouncedMaxReadyTimeText(value);
				break;
			case 'ingredients':
				debouncedAutocompleteText(value);
				break;
		}
	};

	const handle_autocomplete_click: React.MouseEventHandler = e => {
		const option = (e.target as HTMLHeadingElement).id;
		dispatch(addIngredient(option));
		if (activeTextbox) activeTextbox.value = '';
	};

	const handle_filters_toggle = () => {
		containerRef.current?.classList.toggle(styles.show);
	};
	useEffect(() => {
		containerRef.current?.classList.remove(styles.show);
	}, [filters.query]);

	return (
		<>
			<button className={styles.filters_btn} onClick={handle_filters_toggle}>
				Filters
			</button>
			<div className={styles.container} ref={containerRef}>
				<div className={styles.searchbarContainer}>
					<RecipeSearchbar />
				</div>
				<div className={styles.filterContainer}>
					<div ref={filtersDivRef} className={styles.filters}>
						<Dropdown
							filterName='sortType'
							options={sortValues}
							inputType='radio'
							handle_input={handle_input}
							selectedDropdownItems={[filters.sortType]}>
							Sort By
						</Dropdown>
						<Dropdown
							filterName='cuisine'
							options={cuisineValues}
							inputType='checkbox'
							handle_input={handle_input}
							selectedDropdownItems={filters.cuisine}>
							Cuisine
						</Dropdown>
						<Dropdown
							filterName='type'
							options={mealTypeValues}
							inputType='checkbox'
							handle_input={handle_input}
							selectedDropdownItems={filters.type}>
							Meal Type
						</Dropdown>
						<FilterOption
							id='Ingredients'
							filter='ingredients'
							inputType='text'
							handle_input={handle_input}
							inputAttributes={{ placeholder: 'Search...' }}
							selectedAutocompleteItems={filters.ingredients}
							isSolo={true}>
							Ingredients
						</FilterOption>

						<FilterOption
							id='Max Ready Time'
							filter='maxReadyTime'
							inputType='number'
							handle_input={handle_input}
							inputAttributes={{ min: 0, step: 5 }}
							isSolo={true}>
							<>
								Max Ready Time<span style={{ fontWeight: 200, fontSize: '0.9em' }}>(mins)</span>
							</>
						</FilterOption>
						<FilterOption
							id='true'
							filter='instructionsRequired'
							inputType='checkbox'
							handle_input={handle_input}
							isSolo={true}
							selectedDropdownItems={[filters.instructionsRequired.toString()]}>
							Instructions Required
						</FilterOption>
						<FilterOption
							id='true'
							filter='ignoreProfileFilters'
							inputType='checkbox'
							handle_input={handle_input}
							isSolo={true}
							selectedDropdownItems={[filters.ignoreProfileFilters.toString()]}>
							Ignore Profile Filters
						</FilterOption>
					</div>
				</div>

				{activeTextbox instanceof HTMLInputElement && autocompleteOptions?.length ? (
					<AutocompleteDropdown
						options={autocompleteOptions.map((o: any) => o.name)}
						activeTextbox={activeTextbox}
						handle_autocomplete_click={handle_autocomplete_click}
						selected={filters.ingredients}
					/>
				) : null}
			</div>
		</>
	);
}

export default SearchFilters;
