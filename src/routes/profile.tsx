import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { createRef, useEffect, useState } from 'react';
import AutocompleteInput from '../components/autocomplete_input';
import Dropdown from '../components/search_filter/dropdown';
import SpecialInput from '../components/special_input';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setUser } from '../redux/slices/userSlice';
import styles from '../styles/profile.module.scss';
import inputStyles from '../styles/special_input.module.scss';
import type { IAxiosErrorData } from '../types/errors';
import type { AutocompleteInputName } from '../types/input';
import type { IAutocompleteIngredient } from '../types/recipe';
import type { SignUpSelectionType } from '../types/sign_up';
import { dietValues, intoleranceValues } from '../utils/filter_values';

export const Route = createFileRoute('/profile')({
	component: RouteComponent,
});

type Setting = SignUpSelectionType | 'change_username' | 'change_password';

function RouteComponent() {
	const settings: Setting[] = [
		'diet',
		'intolerances',
		'excluded_ingredients',
		'change_username',
		'change_password',
	];
	const user = useAppSelector(state => state.user);
	const dispatch = useAppDispatch();

	const formRef = createRef<HTMLFormElement>();

	const [diet, setDiet] = useState<string>('');
	const [intolerances, setIntolerances] = useState<string[]>([]);
	const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
	const [username, setUsername] = useState<string>('');
	const [currentPassword, setCurrentPassword] = useState<string>('');
	const [password, setPassword] = useState<string>('');
	const [confirmPassword, setConfirmPassword] = useState<string>('');
	const [currentSetting, setCurrentSetting] = useState<Setting>();

	useEffect(() => {
		setDiet(user.diet);
		setIntolerances(user.intolerances);
		setExcludedIngredients(user.excludedIngredients);
		setUsername(user.username);

		setCurrentSetting('diet');
	}, []);

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

	const handle_setting_click = (e: React.MouseEvent<HTMLLIElement>) => {
		const target = e.target as HTMLLIElement;
		const id = target.id as SignUpSelectionType;
		if (id) setCurrentSetting(id);
	};

	const handle_diet_selection = (e?: React.FormEvent<HTMLDivElement>) => {
		const target = e?.target as HTMLDivElement;
		if (!target?.id) return;
		setDiet(target.id);
	};

	const handle_intolerance_selection = (e?: React.FormEvent<HTMLDivElement>) => {
		const target = e?.target as HTMLDivElement;
		const selectionType = target?.dataset?.filter as SignUpSelectionType;
		const input = target.querySelector('#checkbox') as HTMLDivElement;

		if (!(target?.id && selectionType && input)) return;

		if (input.dataset.checked === 'false') {
			if (selectionType === 'intolerances') {
				setIntolerances([...intolerances, target.id]);
			}
		} else {
			if (selectionType === 'intolerances') {
				const index = intolerances.indexOf(target.id);
				const newIntoleranceList = intolerances.slice(0, index).concat(intolerances.slice(index + 1));
				setIntolerances(newIntoleranceList);
			}
		}
	};

	const handle_username_change = async (e?: React.ChangeEvent<HTMLInputElement>) => {
		const target = e?.target;
		if (!target?.value) return;

		setUsername(target.value);
	};

	const check_password_match = () => {
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

	const handle_current_password_change = async (e?: React.ChangeEvent<HTMLInputElement>) => {
		const target = e?.target;
		if (!target?.value) return;

		setCurrentPassword(target.value);
	};

	const handle_password_change = async (e?: React.ChangeEvent<HTMLInputElement>) => {
		const target = e?.target;
		if (!target?.value) return;

		check_password_match();
		setPassword(target.value);
	};

	const handle_confirm_password_change = async (e?: React.ChangeEvent<HTMLInputElement>) => {
		const target = e?.target;
		if (!target?.value) return;

		check_password_match();
		setConfirmPassword(target.value);
	};

	const render_contents = (): React.JSX.Element => {
		switch (currentSetting) {
			case 'diet':
				return (
					<Dropdown
						key={'diet_dropdown'}
						filterName='diet'
						options={dietValues}
						inputType='radio'
						handle_input={handle_diet_selection}
						selectedDropdownItems={[diet]}>
						Diet
					</Dropdown>
				);
			case 'intolerances':
				return (
					<Dropdown
						key={'intolerance_dropdown'}
						filterName='intolerances'
						options={intoleranceValues}
						inputType='checkbox'
						handle_input={handle_intolerance_selection}
						selectedDropdownItems={intolerances}>
						Intolerances
					</Dropdown>
				);
			case 'excluded_ingredients':
				return (
					<AutocompleteInput
						name='excluded_ingredients'
						handle_selected_ingredient_click={handle_selected_ingredient_click}
						add_item={add_item}
						get_autocomplete_list={get_autocomplete_ingredients}
						selected={excludedIngredients}
					/>
				);
			case 'change_username':
				return (
					<div className={styles.user_values}>
						<SpecialInput
							key={'username'}
							placeholder={'username'}
							inputAttr={{ type: 'text' }}
							value={user.username}
							onChange={handle_username_change}
						/>
					</div>
				);
			case 'change_password':
				return (
					<div className={styles.user_values}>
						<SpecialInput
							key={'current_password'}
							placeholder={'Current Password'}
							inputAttr={{ type: 'password', required: true }}
							onChange={handle_current_password_change}
						/>
						<SpecialInput
							key={'password'}
							placeholder={'password'}
							inputAttr={{
								type: 'password',
								onFocus: check_password_match,
								onBlur: check_password_match,
								onChange: handle_password_change,
								id: 'password',
								required: true,
							}}
						/>
						<SpecialInput
							key={'confirm_password'}
							placeholder={'confirm password'}
							inputAttr={{
								type: 'password',
								onFocus: check_password_match,
								onBlur: check_password_match,
								onChange: handle_confirm_password_change,
								id: 'confirmPassword',
								required: true,
							}}
						/>
					</div>
				);
			default:
				return <></>;
		}
	};

	const update_profile = async (e: any) => {
		if (!formRef.current?.checkValidity() || !formRef?.current) return;
		e.preventDefault();

		try {
			switch (currentSetting) {
				case 'diet':
					{
						const res = await axios.put(`${import.meta.env.VITE_API_BASE}/updateDiet`, {
							id: user.id,
							newDiet: diet,
						});

						const newDiet = await res.data;
						if (newDiet === diet) dispatch(setUser({ ...user, diet }));
					}
					break;
				case 'intolerances':
					{
						const res = await axios.put(`${import.meta.env.VITE_API_BASE}/updateIntolerances`, {
							id: user.id,
							newIntolerances: intolerances,
						});

						const newIntolerances = await res.data;
						if (newIntolerances === intolerances) dispatch(setUser({ ...user, intolerances }));
					}
					break;
				case 'excluded_ingredients':
					{
						const res = await axios.put(`${import.meta.env.VITE_API_BASE}/updateExcludedIngredients`, {
							id: user.id,
							newExcludedIngredients: excludedIngredients,
						});

						const newExcludedIngredients = await res.data;
						if (newExcludedIngredients === excludedIngredients) {
							dispatch(setUser({ ...user, excludedIngredients }));
						}
					}
					break;
				case 'change_username':
					{
						const res = await axios.put(`${import.meta.env.VITE_API_BASE}/updateUsername`, {
							id: user.id,
							newUsername: username,
						});

						const newUsername = await res.data;
						if (newUsername === username) dispatch(setUser({ ...user, username }));
					}
					break;
				case 'change_password':
					{
						if (password !== confirmPassword) {
							alert('Passwords must match');
							return;
						}

						const res = await axios.put(`${import.meta.env.VITE_API_BASE}/updatePassword`, {
							id: user.id,
							password: currentPassword,
							newPassword: password,
						});

						const data = await res.data;
						if (!data) throw new Error('Unable to update password');
						formRef.current.reset();
					}
					break;
			}
		} catch (error: any) {
			const err: IAxiosErrorData = error.response?.data;

			if (err) console.log(err.error);
			else console.log(error);
		}
	};

	return (
		<div className={styles.container}>
			<div className={styles.settings_container}>
				<h3 className={styles.settings_header}>Account Settings</h3>
				<ul className={styles.setting_list}>
					{settings.map(name => (
						<li
							key={name}
							onClick={e => handle_setting_click(e)}
							id={name}
							className={`${styles.setting} ${name === currentSetting ? styles.selected : null}`}>
							{name.replace('_', ' ')}
						</li>
					))}
				</ul>
			</div>

			<div className={styles.content}>
				<form ref={formRef} className={styles.form}>
					{render_contents()}
					<div className={styles.update_btn_container}>
						<button onClick={update_profile} className={styles.update_btn}>
							Update Profile
						</button>
					</div>
				</form>
			</div>
		</div>
	);
}
