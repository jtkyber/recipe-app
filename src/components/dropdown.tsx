// import { useState } from 'react';
import { createRef } from 'react';
import styles from '../styles/dropdown.module.scss';
import type { InputType } from '../types/dropdown';
import DropdownOption from './dropdown_option';

function Dropdown({ options, inputType }: { options: string[]; inputType: InputType }) {
	// const [dropped, setDropped] = useState(false);
	const optionsRef = createRef<HTMLDivElement>();

	const toggle_dropdown: React.MouseEventHandler<HTMLDivElement> = () => {
		if (inputType === 'text') return;
		optionsRef.current?.classList.toggle(styles.show);
	};

	const handle_input: React.MouseEventHandler<HTMLDivElement> = e => {
		const target = e.target as HTMLDivElement;
		switch (inputType) {
			case 'checkbox':
				toggle_checkbox(target);
				break;
			case 'radio':
				select_radio(target);
				break;
		}
	};

	const toggle_checkbox = (selectedOption: HTMLDivElement) => {
		const input = selectedOption.querySelector('#checkbox') as HTMLDivElement;
		input.dataset.checked = input.dataset.checked === 'true' ? 'false' : 'true';
	};

	const select_radio = (selectedOption: HTMLDivElement) => {
		const allOptions = optionsRef.current?.children;
		if (!allOptions) return;

		for (const option of allOptions) {
			const input = option.querySelector('#radio') as HTMLDivElement;
			if (option === selectedOption) input.dataset.checked = 'true';
			else input.dataset.checked = 'false';
		}
	};

	return (
		<div className={styles.container}>
			<div onClick={toggle_dropdown} className={styles.dropdown_label_container}>
				<h4 className={styles.dropdown_label}>Cuisine</h4>
				{inputType === 'text' ? (
					<input className={styles.textbox} type='text' />
				) : (
					<h2 className={styles.dropdown_active_symbol}>&#x2304;</h2>
				)}
			</div>
			{inputType === 'text' ? null : (
				<div ref={optionsRef} className={styles.options}>
					{inputType === 'radio' ? (
						<DropdownOption inputType={inputType} handle_input={handle_input} option={'None'} />
					) : null}
					{options.map((option, index) => (
						<DropdownOption key={index} inputType={inputType} handle_input={handle_input} option={option} />
					))}
				</div>
			)}
		</div>
	);
}

export default Dropdown;
