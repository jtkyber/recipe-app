import { useState, type JSX } from 'react';
import type { FilterProperty } from '../../redux/slices/searchFilterSlice';
import styles from '../../styles/search_filter/dropdown.module.scss';
import type { InputType } from '../../types/dropdown';
import FilterOption from './filter_option';

function Dropdown({
	filterName,
	options,
	inputType,
	handle_input,
	children,
}: {
	filterName: FilterProperty;
	options: string[];
	inputType: InputType;
	handle_input: (e: React.FormEvent<HTMLDivElement>, inputType: InputType) => void;
	children: string | JSX.Element | JSX.Element[];
}) {
	const [dropped, setDropped] = useState(false);
	const [searchFilterText, setSearchFilterText] = useState('');

	const handle_searchbar_input: React.ChangeEventHandler = e => {
		const target = e.target as HTMLInputElement;
		const text: string = target.value.toLowerCase();
		setSearchFilterText(text);
	};

	return (
		<div className={styles.container}>
			<div onClick={() => setDropped(!dropped)} className={styles.dropdown_label_container}>
				<h4 className={styles.dropdown_label}>{children}</h4>
				<h2 className={`${styles.dropdown_active_symbol} ${dropped ? styles.dropped : null}`}>
					{dropped ? '\u2303' : '\u2304'}
				</h2>
			</div>
			<div className={`${styles.options} ${dropped ? styles.show : null}`}>
				<input
					onChange={handle_searchbar_input}
					type='text'
					className={styles.optionSearchbar}
					placeholder='Filter...'
				/>
				{inputType === 'radio' ? (
					<FilterOption name='None' filter={filterName} inputType={inputType} handle_input={handle_input}>
						None
					</FilterOption>
				) : null}
				{options
					.filter(o => o.toLowerCase().includes(searchFilterText))
					.map((option, index) => (
						<FilterOption
							name={option}
							filter={filterName}
							key={index}
							inputType={inputType}
							handle_input={handle_input}>
							{option}
						</FilterOption>
					))}
			</div>
		</div>
	);
}

export default Dropdown;
