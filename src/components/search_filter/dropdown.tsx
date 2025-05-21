import { createRef, useState, type JSX } from 'react';
import type { FilterProperties } from '../../redux/slices/searchFilterSlice';
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
	filterName: FilterProperties;
	options: string[];
	inputType: InputType;
	handle_input: (e: React.MouseEvent<Element, MouseEvent>, inputType: InputType) => void;
	children: string | JSX.Element | JSX.Element[];
}) {
	const [dropped, setDropped] = useState(false);
	const optionsRef = createRef<HTMLDivElement>();

	return (
		<div className={styles.container}>
			<div onClick={() => setDropped(!dropped)} className={styles.dropdown_label_container}>
				<h4 className={styles.dropdown_label}>{children}</h4>
				<h2 className={styles.dropdown_active_symbol}>{dropped ? '\u2303' : '\u2304'}</h2>
			</div>
			<div ref={optionsRef} className={`${styles.options} ${dropped ? styles.show : null}`}>
				{inputType === 'radio' ? (
					<FilterOption name='None' filter={filterName} inputType={inputType} handle_input={handle_input}>
						None
					</FilterOption>
				) : null}
				{options.map((option, index) => (
					<FilterOption
						name={option.toLowerCase()}
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
