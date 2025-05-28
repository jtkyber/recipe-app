import { useQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { createRef, useEffect, useState, type ChangeEvent } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import AutocompleteDropdown from '../components/search_filter/autocompleteDropdown';
import Dropdown from '../components/search_filter/dropdown';
import styles from '../styles/sign_up.module.scss';
import type { SignUpSelectionType } from '../types/sign_up';
import { dietValues } from '../utils/filter_values';

export const Route = createFileRoute('/sign_up')({
	component: RouteComponent,
});

function RouteComponent() {
	const [activeTextbox, setActiveTextbox] = useState<HTMLInputElement | null>(null);
	const [autocompleteText, setAutocompleteText] = useState<string>('');
	const [diet, setDiet] = useState<string>('');
	const [intolerances, setIntolerances] = useState<string[]>([]);
	const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
	const formRef = createRef<HTMLFormElement>();
	const selectedIngredientsRef = createRef<HTMLDivElement>();
	const debouncedAutocompleteText = useDebouncedCallback((value: any) => {
		setAutocompleteText(value);
	}, 500);

	const { refetch, data: autocompleteOptions } = useQuery({
		queryKey: ['autocomplete'],
		queryFn: get_autocomplete_ingredients,
		enabled: false,
	});

	useEffect(() => {
		const form = formRef.current;
		if (!form) return;

		form.addEventListener('focusin', handle_focus_in, true);
		form.addEventListener('focusout', handle_focus_out, true);

		return () => {
			if (!form) return;

			form.removeEventListener('focusin', handle_focus_in, true);
			form.removeEventListener('focusout', handle_focus_out, true);
		};
	}, []);
	useEffect(() => {
		refetch();
	}, [autocompleteText]);

	async function get_autocomplete_ingredients() {
		if (!autocompleteText.length) return [];

		const res = await fetch(
			'https://api.spoonacular.com/food/ingredients/autocomplete?' +
				new URLSearchParams({
					query: autocompleteText,
					number: '10',
				}),
			{
				headers: {
					'x-api-key': import.meta.env.VITE_SPOONACULAR_API_KEY,
				},
			}
		);
		if (!res.ok) throw new Error('Unable to fetch ingredients');
		const data = await res.json();
		return data;
	}

	function handle_focus_in(e: Event) {
		const target = e.target;
		if (!(target instanceof HTMLInputElement)) return;
		setActiveTextbox(target);
	}
	function handle_focus_out() {
		setActiveTextbox(null);
		setAutocompleteText('');
	}

	const handle_radio = (selectedOption: HTMLDivElement, selectionType: SignUpSelectionType) => {
		const form = document.querySelector(`.${styles.sign_up_form}`) as HTMLFormElement;

		const allOptions = form.querySelectorAll(`[data-filter="${selectionType}"]`);
		for (const option of allOptions) {
			if (option === selectedOption) {
				if (selectionType === 'diet') {
					setDiet(option.id);
				}
			}
		}
	};

	const handle_checkbox = (selectedOption: HTMLDivElement, selectionType: SignUpSelectionType) => {
		const input = selectedOption.querySelector('#checkbox') as HTMLDivElement;
		if (input.dataset.checked === 'false') {
			if (selectionType === 'intolerances' || selectionType === 'excluded_ingredients') {
				setIntolerances([...intolerances, selectedOption.id]);
			}
		} else {
			if (selectionType === 'intolerances' || selectionType === 'excluded_ingredients') {
				const index = intolerances.indexOf(selectedOption.id);
				const newIntoleranceList = intolerances.slice(0, index).concat(intolerances.slice(index + 1));
				setIntolerances(newIntoleranceList);
			}
		}
	};

	const handle_ingredient_input: (e: ChangeEvent) => void = e => {
		const target = e.target as HTMLInputElement;
		debouncedAutocompleteText(target.value);
	};

	const handle_input: (e: React.FormEvent<HTMLDivElement>) => void = e => {
		const target = e.target as HTMLDivElement & HTMLInputElement;
		const filter = target.dataset.filter;

		switch (filter) {
			case 'diet':
				handle_radio(target, filter);
				break;
			case 'intolerances':
				handle_checkbox(target, filter);
				break;
		}
	};

	const handle_autocomplete_click: React.MouseEventHandler = e => {
		const option = (e.target as HTMLHeadingElement).id;
		if (activeTextbox && !excludedIngredients.includes(option)) {
			setExcludedIngredients([...excludedIngredients, option]);
			activeTextbox.value = '';
		}
	};

	const handle_selected_ingredient_click: React.MouseEventHandler = e => {
		const target = e.target as HTMLHeadingElement;
		const ingredient = target.id;
		const index = excludedIngredients.indexOf(ingredient);
		const newIngredientList = excludedIngredients
			.slice(0, index)
			.concat(excludedIngredients.slice(index + 1));
		setExcludedIngredients(newIngredientList);
	};

	return (
		<div className={styles.container}>
			<div className={styles.left_container}>
				<div className={styles.text_container}>
					<h2>Title text</h2>
					<p>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus rem deleniti, quis soluta
						ratione, et dolor fugit laboriosam earum similique magnam quibusdam.
					</p>
				</div>
			</div>
			<div className={styles.form_container_scrollable}>
				<div className={styles.form_container}>
					<header>
						<h1>Join Recipe App</h1>
						<p>
							Already have an account?<a>Login</a>
						</p>
					</header>
					<form ref={formRef} className={styles.sign_up_form} action=''>
						<div className={styles.username}>
							<input type='text' maxLength={36} required />
						</div>
						<div className={styles.password_container}>
							<div className={styles.password}>
								<input type='password' required />
							</div>
							<div className={styles.confirm_password}>
								<input type='password' required />
							</div>
						</div>
						<div className={styles.excluded_ingredients}>
							<input onChange={handle_ingredient_input} type='text' required />
						</div>
						{excludedIngredients.length ? (
							<div ref={selectedIngredientsRef} className={styles.selected_ingredients}>
								{excludedIngredients?.map(ing => (
									<h5
										id={ing}
										onClick={handle_selected_ingredient_click}
										className={styles.selected_ingredient}>
										{ing}
									</h5>
								))}
							</div>
						) : null}
						<div className={styles.diet}>
							<Dropdown
								filterName='diet'
								options={dietValues}
								inputType='radio'
								handle_input={handle_input}
								selectedDropdownItems={[diet]}
								label_container_styles={{
									border: '1px solid lightgrey',
								}}>
								Diet
							</Dropdown>
						</div>
						<div className={styles.intolerances}>
							<Dropdown
								filterName='intolerances'
								options={dietValues}
								inputType='checkbox'
								handle_input={handle_input}
								selectedDropdownItems={intolerances}
								label_container_styles={{
									border: '1px solid lightgrey',
								}}>
								Intolerances
							</Dropdown>
						</div>
						{activeTextbox instanceof HTMLInputElement && autocompleteOptions?.length ? (
							<AutocompleteDropdown
								activeTextbox={activeTextbox}
								handle_autocomplete_click={handle_autocomplete_click}
							/>
						) : null}
					</form>
				</div>
			</div>
		</div>
	);
}
