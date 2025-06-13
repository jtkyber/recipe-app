import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { useState } from 'react';
import AutocompleteInput from '../components/autocomplete_input';
import SpecialInput from '../components/special_input';
import { useAppSelector } from '../redux/hooks';
import styles from '../styles/profile.module.scss';
import type { AutocompleteInputName } from '../types/input';
import type { IAutocompleteIngredient } from '../types/recipe';
import type { SignUpSelectionType } from '../types/sign_up';

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
	// const dispatch = useAppDispatch();

	// const [diet, setDiet] = useState<string>('');
	// const [intolerances, setIntolerances] = useState<string[]>([]);
	const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);
	const [currentSetting, setCurrentSetting] = useState<Setting>();
	const [editing, setEditing] = useState<boolean>(false);

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

	const render_noneditable_contents = (): React.JSX.Element => {
		switch (currentSetting) {
			case 'diet':
				return <></>;
			case 'intolerances':
				return <></>;
			case 'excluded_ingredients':
				return (
					<div className={styles.user_values}>
						{user.excludedIngredients.map(ing => (
							<h5 className={styles.value} key={ing}>
								{ing}
							</h5>
						))}
					</div>
				);
			case 'change_username':
				return (
					<div className={styles.user_values}>
						<SpecialInput
							key={'username'}
							placeholder={'username'}
							inputAttr={{ type: 'text' }}
							value={user.username}
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

	const render_editable_contents = (): React.JSX.Element => {
		switch (currentSetting) {
			case 'diet':
				return <></>;
			case 'intolerances':
				return <></>;
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
				return <></>;
			case 'change_password':
				return <></>;
			default:
				return <></>;
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
				{editing ? (
					render_editable_contents()
				) : (
					<div className={styles.non_editable}>{render_noneditable_contents()}</div>
				)}
			</div>
		</div>
	);
}
