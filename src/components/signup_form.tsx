import { useNavigate } from '@tanstack/react-router';
import axios from 'axios';
import { createRef, useState } from 'react';
import { useAppDispatch } from '../redux/hooks';
import { setUser } from '../redux/slices/userSlice';
import styles from '../styles/auth/signup_form.module.scss';
import inputStyles from '../styles/special_input.module.scss';
import type { IAxiosErrorData } from '../types/errors';
import type { AutocompleteInputName } from '../types/input';
import type { IAutocompleteIngredient } from '../types/recipe';
import type { SignUpSelectionType } from '../types/sign_up';
import type { IUser } from '../types/user';
import { setCookie } from '../utils/cookies';
import { dietValues, intoleranceValues } from '../utils/filter_values';
import AutocompleteInput from './autocomplete_input';
import Dropdown from './search_filter/dropdown';
import SpecialInput from './special_input';

function SignupForm() {
	const dispatch = useAppDispatch();

	const [diet, setDiet] = useState<string>('');
	const [intolerances, setIntolerances] = useState<string[]>([]);
	const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);

	const formRef = createRef<HTMLFormElement>();

	const navigate = useNavigate();

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

			setCookie('id', data.id.toString(), 7);

			dispatch(setUser(data));

			if (data.id > 0) navigate({ to: '/search' });
		} catch (error: any) {
			const err: IAxiosErrorData = error.response?.data;

			if (err) console.log(err.error);
			else console.log(error);
			// switch (err?.code) {
			// 	case '23505':
			// 		alert('User already exists');
			// 		break;
			// 	default:
			// 		console.log(err);
			// }
		}
	}

	async function get_autocomplete_ingredients(text: string): Promise<string[]> {
		if (!text.length) return [];

		const res = await axios('http://localhost:3000/getRecipeAutocomplete?', {
			params: {
				text: text,
				count: '10',
			},
		});
		if (!res) throw new Error('Unable to fetch ingredients');
		const data: IAutocompleteIngredient[] = res.data;
		return data.map(d => d.name);
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

	const add_item = (item: string, inputName: AutocompleteInputName): void => {
		switch (inputName) {
			case 'excluded_ingredients':
				setExcludedIngredients([...excludedIngredients, item]);
				break;
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

	const check_password_match: React.ChangeEventHandler = () => {
		const password = formRef.current?.querySelector('#password') as HTMLInputElement;
		const confirmPassword = formRef.current?.querySelector('#confirmPassword') as HTMLInputElement;
		const inputFocused = document.activeElement === password || document.activeElement === confirmPassword;

		const toggleClass = (className: string, action: 'add' | 'remove') => {
			switch (action) {
				case 'add':
					password.classList.add(inputStyles[className]);
					confirmPassword.classList.add(inputStyles[className]);
					break;
				case 'remove':
					password.classList.remove(inputStyles[className]);
					confirmPassword.classList.remove(inputStyles[className]);
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
		<form ref={formRef} className={styles.sign_up_form}>
			<SpecialInput
				placeholder={'username'}
				inputAttr={{ id: 'username', type: 'text', maxLength: 36, required: true }}
			/>
			<div className={styles.password_container}>
				<SpecialInput
					placeholder={'password'}
					inputAttr={{
						onFocus: check_password_match,
						onBlur: check_password_match,
						onChange: check_password_match,
						id: 'password',
						type: 'password',
						required: true,
					}}
				/>

				<SpecialInput
					placeholder={'confirm password'}
					inputAttr={{
						onFocus: check_password_match,
						onBlur: check_password_match,
						onChange: check_password_match,
						id: 'confirmPassword',
						type: 'password',
						required: true,
					}}
				/>
			</div>

			<AutocompleteInput
				name='excluded_ingredients'
				handle_selected_ingredient_click={handle_selected_ingredient_click}
				add_item={add_item}
				get_autocomplete_list={get_autocomplete_ingredients}
				selected={excludedIngredients}
			/>

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
			<div className={styles.submitBtnContainer}>
				<button type='submit' onClick={sign_up}>
					Join
				</button>
			</div>
		</form>
	);
}

export default SignupForm;
