import { type InputHTMLAttributes, type ReactElement } from 'react';
import { useAppSelector } from '../../redux/hooks';
import type { FilterProperties } from '../../redux/slices/searchFilterSlice';
import styles from '../../styles/search_filter/filter_option.module.scss';
import type { InputType } from '../../types/dropdown';

function FilterOption({
	name,
	filter,
	inputType,
	handle_input,
	inputAttributes,
	children,
}: {
	name: string;
	filter: FilterProperties;
	inputType: InputType;
	handle_input: (e: React.MouseEvent<Element, MouseEvent>, inputType: InputType) => void;
	inputAttributes?: InputHTMLAttributes<any>;
	children: string | ReactElement;
}) {
	const filters = useAppSelector(state => state.searchFilter);

	const is_checked = Array.isArray(filters[filter]) ? filters[filter].includes(name) : false;

	return (
		<div
			id={name}
			data-filter={filter}
			onClick={(e: React.MouseEvent<Element, MouseEvent>) => handle_input(e, inputType)}
			className={styles.option}>
			<h4 className={styles.label}>{children}</h4>
			{inputType === 'checkbox' ? (
				<div {...inputAttributes} id='checkbox' data-checked={is_checked} className={styles.checkbox}></div>
			) : inputType === 'radio' ? (
				<div {...inputAttributes} id='radio' data-checked={is_checked} className={styles.radio}></div>
			) : inputType === 'text' ? (
				<input {...inputAttributes} className={styles.textbox} type='text' />
			) : inputType === 'number' ? (
				<input {...inputAttributes} className={styles.textbox} type='number' />
			) : null}
		</div>
	);
}

export default FilterOption;
