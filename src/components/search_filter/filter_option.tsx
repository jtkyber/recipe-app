import { type InputHTMLAttributes, type ReactElement } from 'react';
import type { FilterProperty } from '../../redux/slices/searchFilterSlice';
import styles from '../../styles/search_filter/filter_option.module.scss';
import type { InputType } from '../../types/dropdown';

function FilterOption({
	name,
	filter,
	inputType,
	handle_input,
	inputAttributes,
	children,
	show = true,
}: {
	name: string; // Must match casing & spelling in API
	filter: FilterProperty;
	inputType: InputType;
	handle_input: (e: React.FormEvent<HTMLDivElement>, inputType: InputType) => void;
	inputAttributes?: InputHTMLAttributes<any>;
	children: string | ReactElement;
	show?: boolean;
}) {
	return (
		<div
			id={name}
			data-filter={filter}
			onClick={(e: React.FormEvent<HTMLDivElement>) => handle_input(e, inputType)}
			onChange={(e: React.FormEvent<HTMLDivElement>) => handle_input(e, inputType)}
			className={styles.option}
			style={{ display: show ? 'flex' : 'none' }}>
			<h4 className={styles.label}>{children}</h4>
			{inputType === 'checkbox' ? (
				<div {...inputAttributes} id='checkbox' data-checked={false} className={styles.checkbox}></div>
			) : inputType === 'radio' ? (
				<div {...inputAttributes} id='radio' data-checked={false} className={styles.radio}></div>
			) : inputType === 'text' ? (
				<input {...inputAttributes} id='text' className={styles.textbox} type='text' />
			) : inputType === 'number' ? (
				<input {...inputAttributes} id='number' className={styles.textbox} type='number' />
			) : null}
		</div>
	);
}

export default FilterOption;
