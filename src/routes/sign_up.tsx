import { useQuery } from '@tanstack/react-query';
import { createFileRoute, useRouter } from '@tanstack/react-router';
import axios from 'axios';
import { createRef, useEffect, useState, type ChangeEvent, type ChangeEventHandler } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import AutocompleteDropdown from '../components/search_filter/autocompleteDropdown';
import Dropdown from '../components/search_filter/dropdown';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setUser } from '../redux/slices/userSlice';
import styles from '../styles/sign_up.module.scss';
import type { IAxiosErrorData } from '../types/errors';
import type { SignUpSelectionType } from '../types/sign_up';
import type { IUser } from '../types/user';
import { dietValues, intoleranceValues } from '../utils/filter_values';

export const Route = createFileRoute('/sign_up')({
	component: RouteComponent,
});

function RouteComponent() {
	const dispatch = useAppDispatch();
	const user = useAppSelector(state => state.user);

	const [activeTextbox, setActiveTextbox] = useState<HTMLInputElement | null>(null);
	const [autocompleteText, setAutocompleteText] = useState<string>('');
	const [diet, setDiet] = useState<string>('');
	const [intolerances, setIntolerances] = useState<string[]>([]);
	const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);

	const formRef = createRef<HTMLFormElement>();
	const selectedIngredientsRef = createRef<HTMLDivElement>();

	const router = useRouter();

	const debouncedAutocompleteText = useDebouncedCallback((value: any) => {
		setAutocompleteText(value);
	}, 500);

	const { refetch: refetchAutocomplete, data: autocompleteOptions } = useQuery({
		queryKey: ['autocomplete'],
		queryFn: get_autocomplete_ingredients,
		enabled: false,
	});

	useEffect(() => {
		const form = formRef.current;
		if (!form) return;

		form.addEventListener('focusin', handle_focus_in, true);
		form.addEventListener('focusout', handle_focus_out, true);
		form.addEventListener('input', handle_form_change, true);

		return () => {
			if (!form) return;

			form.removeEventListener('focusin', handle_focus_in, true);
			form.removeEventListener('focusout', handle_focus_out, true);
			form.removeEventListener('input', handle_form_change, true);
		};
	}, []);
	useEffect(() => {
		refetchAutocomplete();
	}, [autocompleteText]);
	useEffect(() => {
		if (user.id > 0) {
			router.navigate({
				to: '/',
				replace: false,
			});
		}
	}, [user]);

	async function sign_up(e: any): Promise<any> {
		try {
			// Prevent page reload but still check validity of inputs
			if (!formRef.current?.checkValidity()) return;
			e.preventDefault();

			const username = formRef.current?.querySelector('#username') as HTMLInputElement;
			const password = formRef.current?.querySelector('#password') as HTMLInputElement;
			const confirmPassword = formRef.current?.querySelector('#confirmPassword') as HTMLInputElement;

			if (!(username?.value && password?.value && confirmPassword?.value)) return;

			const res = await axios.post('http://localhost:3000/signUp', {
				username: username.value.trim(),
				password: password.value,
				confirmPassword: confirmPassword.value,
				excludedIngredients: excludedIngredients,
				diet: diet,
				intolerances: intolerances,
			});

			if (!res) throw new Error('Sign up failed');
			const data: IUser = res.data;
			dispatch(setUser(data));
		} catch (error: any) {
			const err: IAxiosErrorData = error.response?.data;
			switch (err?.code) {
				case '23505':
					console.log('User already exists');
					break;
				default:
					console.log(err);
			}
		}
	}

	async function get_autocomplete_ingredients() {
		if (!autocompleteText.length) return [];

		const res = await axios('https://api.spoonacular.com/food/ingredients/autocomplete?', {
			params: {
				query: autocompleteText,
				number: '10',
			},
			headers: {
				'x-api-key': import.meta.env.VITE_SPOONACULAR_API_KEY,
			},
		});
		if (!res) throw new Error('Unable to fetch ingredients');
		const data = res.data;
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

	function handle_form_change(e: Event) {
		const target = e.target;
		if (target instanceof HTMLInputElement) {
			if (target.value) {
				target.classList.add(styles.has_text);
			} else {
				target.classList.remove(styles.has_text);
			}
		}
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
			if (selectionType === 'intolerances') {
				setIntolerances([...intolerances, selectedOption.id]);
			}
		} else {
			if (selectionType === 'intolerances') {
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

	const check_password_match: ChangeEventHandler = () => {
		const password = formRef.current?.querySelector('#password') as HTMLInputElement;
		const confirmPassword = formRef.current?.querySelector('#confirmPassword') as HTMLInputElement;
		const inputFocused = document.activeElement === password || document.activeElement === confirmPassword;

		const toggleClass = (className: string, action: 'add' | 'remove') => {
			switch (action) {
				case 'add':
					password.classList.add(styles[className]);
					confirmPassword.classList.add(styles[className]);
					break;
				case 'remove':
					password.classList.remove(styles[className]);
					confirmPassword.classList.remove(styles[className]);
					break;
			}
		};

		if (password.value === confirmPassword.value) {
			if (inputFocused) toggleClass('matches', 'add');
			else toggleClass('matches', 'remove');
			toggleClass('noMatch', 'remove');
		} else {
			toggleClass('noMatch', 'add');
			toggleClass('matches', 'remove');
		}
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
					<form ref={formRef} className={styles.sign_up_form}>
						<div className={styles.username}>
							<input id='username' type='text' maxLength={36} required />
						</div>
						<div className={styles.password_container}>
							<div className={styles.password}>
								<input
									onFocus={check_password_match}
									onBlur={check_password_match}
									onChange={check_password_match}
									id='password'
									type='password'
									required
								/>
							</div>
							<div className={styles.confirm_password}>
								<input
									onFocus={check_password_match}
									onBlur={check_password_match}
									onChange={check_password_match}
									id='confirmPassword'
									type='password'
									required
								/>
							</div>
						</div>
						<div className={styles.excluded_ingredients}>
							<input id='excludedIngredients' onChange={handle_ingredient_input} type='text' />
						</div>
						{excludedIngredients.length ? (
							<div ref={selectedIngredientsRef} className={styles.selected_ingredients}>
								{excludedIngredients?.map(ing => (
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
								options={intoleranceValues}
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
						<div className={styles.submitBtnContainer}>
							<button type='submit' onClick={sign_up}>
								Join
							</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
