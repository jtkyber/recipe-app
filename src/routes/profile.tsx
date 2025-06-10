import { createFileRoute } from '@tanstack/react-router';
import axios from 'axios';
import { useState } from 'react';
import AutocompleteInput from '../components/autocomplete_input';
import { useAppSelector } from '../redux/hooks';
import styles from '../styles/profile.module.scss';
import type { AutocompleteInputName } from '../types/input';
import type { IAutocompleteIngredient } from '../types/recipe';

export const Route = createFileRoute('/profile')({
	component: RouteComponent,
});

function RouteComponent() {
	const user = useAppSelector(state => state.user);
	// const dispatch = useAppDispatch();

	// const [diet, setDiet] = useState<string>('');
	// const [intolerances, setIntolerances] = useState<string[]>([]);
	const [excludedIngredients, setExcludedIngredients] = useState<string[]>([]);

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

	return (
		<div className={styles.scrollable_container}>
			<form className={styles.form}>
				<h2 className={styles.username}>{user.username}</h2>
				<AutocompleteInput
					name='excluded_ingredients'
					handle_selected_ingredient_click={handle_selected_ingredient_click}
					add_item={add_item}
					get_autocomplete_list={get_autocomplete_ingredients}
					selected={excludedIngredients}
				/>
			</form>
		</div>
	);
}
