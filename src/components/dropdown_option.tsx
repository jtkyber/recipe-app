import type { MouseEventHandler } from 'react';
import styles from '../styles/dropdown.module.scss';
import type { InputType } from '../types/dropdown';

function DropdownOption({
	inputType,
	handle_input,
	option,
}: {
	inputType: InputType;
	handle_input: MouseEventHandler<HTMLDivElement>;
	option: string;
}) {
	return (
		<div onClick={handle_input} className={styles.option}>
			<h4 className={styles.label}>{option}</h4>
			{inputType === 'checkbox' ? (
				<div id='checkbox' data-checked='false' className={styles.checkbox}></div>
			) : inputType === 'radio' ? (
				<div id='radio' data-checked='false' className={styles.radio}></div>
			) : null}
		</div>
	);
}

export default DropdownOption;
