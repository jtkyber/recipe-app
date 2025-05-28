import { type InputHTMLAttributes, type MouseEventHandler, type ReactElement } from 'react';
import { useAppDispatch } from '../../redux/hooks';
import { removeIngredient, type FilterProperty } from '../../redux/slices/searchFilterSlice';
import styles from '../../styles/search_filter/filter_option.module.scss';
import type { InputType } from '../../types/dropdown';
import type { SignUpSelectionType } from '../../types/sign_up';

function FilterOption({
	id,
	filter,
	inputType,
	handle_input,
	inputAttributes,
	children,
	show = true,
	selectedAutocompleteItems = [],
	selectedDropdownItems = [],
	isSolo = false,
}: {
	id: string; // Must match casing & spelling in API
	filter: FilterProperty | SignUpSelectionType;
	inputType: InputType;
	handle_input: (e: React.FormEvent<HTMLDivElement>, inputType: InputType) => void;
	inputAttributes?: InputHTMLAttributes<any>;
	children: string | ReactElement;
	show?: boolean;
	selectedDropdownItems?: string[];
	selectedAutocompleteItems?: string[];
	isSolo?: boolean;
}) {
	const dispatch = useAppDispatch();

	const remove_selected: MouseEventHandler = e => {
		const target = e.target as HTMLElement;
		const itemToRemove = target.innerText;
		switch (filter) {
			case 'ingredients':
				dispatch(removeIngredient(itemToRemove));
				break;
		}
	};

	return (
		<div
			id={id}
			data-filter={filter}
			data-input-type={inputType}
			data-is-solo={isSolo}
			onClick={(e: React.FormEvent<HTMLDivElement>) => handle_input(e, inputType)}
			onChange={(e: React.FormEvent<HTMLDivElement>) => handle_input(e, inputType)}
			className={styles.option}
			style={{ display: show ? 'grid' : 'none' }}>
			<div className={styles.optionContainer}>
				<h4 className={styles.label}>{children}</h4>
				{inputType === 'checkbox' ? (
					<div
						{...inputAttributes}
						id='checkbox'
						data-checked={selectedDropdownItems.includes(id)}
						className={styles.checkbox}></div>
				) : inputType === 'radio' ? (
					<div
						{...inputAttributes}
						id='radio'
						data-checked={selectedDropdownItems.includes(id)}
						className={styles.radio}></div>
				) : inputType === 'text' ? (
					<input {...inputAttributes} id='text' className={styles.textbox} type='text' autoComplete='off' />
				) : inputType === 'number' ? (
					<input
						{...inputAttributes}
						id='number'
						className={styles.numberBox}
						type='number'
						autoComplete='off'
					/>
				) : null}
			</div>
			{selectedAutocompleteItems.length ? (
				<div className={styles.selectedItemsContainer}>
					{selectedAutocompleteItems?.map(item => {
						return (
							<h5 onClick={remove_selected} className={styles.item} key={item}>
								{item}
							</h5>
						);
					})}
				</div>
			) : null}
		</div>
	);
}

export default FilterOption;
