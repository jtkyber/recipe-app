import { createRef, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import styles from '../styles/autocomplete_input.module.scss';
import type { AutocompleteInputName } from '../types/input';
import AutocompleteDropdown from './search_filter/autocompleteDropdown';
import SpecialInput from './special_input';

function AutocompleteInput({
	id,
	name,
	handle_selected_ingredient_click,
	add_item,
	get_autocomplete_list,
	selected,
}: {
	id: AutocompleteInputName;
	name: string;
	handle_selected_ingredient_click: React.MouseEventHandler;
	add_item: (item: string, inputName: AutocompleteInputName) => void;
	get_autocomplete_list: (text: string) => Promise<string[]>;
	selected: string[];
}) {
	const [activeTextbox, setActiveTextbox] = useState<HTMLInputElement | null>(null);
	const [autocompleteOptions, setAutocompleteOptions] = useState<string[]>([]);

	const containerRef = createRef<HTMLDivElement>();

	const debouncedAutocompleteText = useDebouncedCallback(async (value: any) => {
		const options = await get_autocomplete_list(value);
		setAutocompleteOptions(options);
	}, 500);

	useEffect(() => {
		const containerEl = containerRef.current;
		const inputEl = containerEl?.querySelector(`#${id}`);
		if (!inputEl) return;

		inputEl.addEventListener('focusin', handle_focus_in, true);
		inputEl.addEventListener('focusout', handle_focus_out, true);

		return () => {
			if (!inputEl) return;

			inputEl.removeEventListener('focusin', handle_focus_in, true);
			inputEl.removeEventListener('focusout', handle_focus_out, true);
		};
	}, []);

	function handle_focus_in(e: Event) {
		const target = e.target;
		if (!(target instanceof HTMLInputElement)) return;
		setActiveTextbox(target);
	}
	function handle_focus_out(e: Event) {
		const target = e.target;
		if (!(target instanceof HTMLInputElement)) return;
		setActiveTextbox(null);
		target.value = '';
	}

	const handle_ingredient_input: (e: React.ChangeEvent) => void = e => {
		const target = e.target as HTMLInputElement;
		debouncedAutocompleteText(target.value);
	};

	const handle_autocomplete_click: React.MouseEventHandler = e => {
		const option = (e.target as HTMLHeadingElement).id;

		if (activeTextbox && !selected.includes(option)) {
			add_item(option, id);
			activeTextbox.value = '';
			setAutocompleteOptions([]);
		}
	};

	return (
		<div ref={containerRef} className={styles.autocomplete_container}>
			<SpecialInput
				placeholder={name}
				inputAttr={{
					onChange: handle_ingredient_input,
					id: id,
					type: 'text',
				}}
			/>
			{selected.length ? (
				<div className={styles.selected_ingredients}>
					{selected?.map(ing => (
						<h5
							key={ing}
							id={ing}
							onClick={handle_selected_ingredient_click}
							className={styles.selected_ingredient}>
							{ing}
						</h5>
					))}
				</div>
			) : null}

			{activeTextbox instanceof HTMLInputElement && autocompleteOptions?.length ? (
				<AutocompleteDropdown
					options={autocompleteOptions}
					activeTextbox={activeTextbox}
					handle_autocomplete_click={handle_autocomplete_click}
					selected={selected}
				/>
			) : null}
		</div>
	);
}

export default AutocompleteInput;
