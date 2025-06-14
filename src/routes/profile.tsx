import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { useEffect, useState } from 'react';
import AutocompleteInput from '../components/autocomplete_input';
import Dropdown from '../components/search_filter/dropdown';
import SpecialInput from '../components/special_input';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { setUser } from '../redux/slices/userSlice';
import styles from '../styles/profile.module.scss';
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

	const [diet, setDiet] = useState<string>('');
	const [intolerances, setIntolerances] = useState<string[]>([]);
	const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
	const [username, setUsername] = useState<string>('');
	// const [password, setPassword] = useState<string>('');
	// const [confirmPassword, setConfirmPassword] = useState<string>('');
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

	const handle_username_change = (e?: React.ChangeEvent<HTMLInputElement>) => {
		const target = e?.target;
		if (!target?.value) return;

		setUsername(target.value);
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
							inputAttr={{ type: 'password' }}
						/>
						<SpecialInput key={'password'} placeholder={'password'} inputAttr={{ type: 'password' }} />
						<SpecialInput
							key={'confirm_password'}
							placeholder={'confirm password'}
							inputAttr={{ type: 'password' }}
						/>
					</div>
				);
			default:
				return <></>;
		}
	};

	const update_profile = () => {
		switch (currentSetting) {
			case 'diet':
				dispatch(setUser({ ...user, diet }));
				break;
			case 'intolerances':
				dispatch(setUser({ ...user, intolerances }));
				break;
			case 'excluded_ingredients':
				dispatch(setUser({ ...user, excludedIngredients }));
				break;
			case 'change_username':
				dispatch(setUser({ ...user, username }));
				break;
		}
	};

	return (
		<div className={styles.scrollable_container}>
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
				<div className={styles.non_editable}>
					{render_contents()}
					<div className={styles.update_btn_container}>
						<button onClick={update_profile} className={styles.update_btn}>
							Update Profile
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
