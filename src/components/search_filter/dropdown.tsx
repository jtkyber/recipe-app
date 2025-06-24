import { useState, type CSSProperties, type JSX } from 'react';
import styles from '../../styles/search_filter/dropdown.module.scss';
import type { InputType } from '../../types/dropdown';
import type { FilterProperty } from '../../types/filters';
import type { SignUpSelectionType } from '../../types/sign_up';
import FilterOption from './filter_option';

function Dropdown({
	filterName,
	options,
	inputType,
	handle_input,
	children,
	selectedDropdownItems,
	label_container_styles,
	includeNoneOption,
}: {
	filterName: FilterProperty | SignUpSelectionType;
	options: string[];
	inputType: InputType;
	handle_input: (e: React.FormEvent<HTMLDivElement>, inputType: InputType) => void;
	children: string | JSX.Element | JSX.Element[];
	selectedDropdownItems?: string[];
	label_container_styles?: CSSProperties;
	includeNoneOption?: boolean;
}) {
	const [dropped, setDropped] = useState(false);
	const [searchFilterText, setSearchFilterText] = useState('');

	const handle_searchbar_input: React.ChangeEventHandler = e => {
		const target = e.target as HTMLInputElement;
		const text: string = target.value.toLowerCase();
		setSearchFilterText(text);
	};

	return (
		<div className={styles.dropdownContainer}>
			<div
				onClick={() => setDropped(!dropped)}
				className={styles.dropdown_label_container}
				style={label_container_styles}>
				<h4 className={styles.dropdown_label}>{children}</h4>
				<h2 className={`${styles.dropdown_active_symbol} ${dropped ? styles.dropped : null}`}>
					{dropped ? '\u2303' : '\u2304'}
				</h2>
			</div>
			<div className={`${styles.options} ${dropped ? styles.show : null}`}>
				{options?.length > 15 ? (
					<input
						onChange={handle_searchbar_input}
						type='text'
						className={styles.optionSearchbar}
						placeholder='Filter...'
					/>
				) : null}
				{inputType === 'radio' && includeNoneOption ? (
					<FilterOption
						id='None'
						filter={filterName}
						inputType={inputType}
						selectedDropdownItems={selectedDropdownItems?.[0] ? selectedDropdownItems : ['None']}
						handle_input={handle_input}>
						None
					</FilterOption>
				) : null}
				{options.map(option => (
					<FilterOption
						id={option}
						filter={filterName}
						key={option}
						inputType={inputType}
						selectedDropdownItems={selectedDropdownItems}
						handle_input={handle_input}
						show={option.toLowerCase().includes(searchFilterText.toLowerCase())}>
						{option}
					</FilterOption>
				))}
			</div>
		</div>
	);
}

export default Dropdown;
