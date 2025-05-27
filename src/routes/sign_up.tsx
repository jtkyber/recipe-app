import { createFileRoute } from '@tanstack/react-router';
import Dropdown from '../components/search_filter/dropdown';
import styles from '../styles/sign_up.module.scss';
import type { SignUpSelectionType } from '../types/sign_up';
import { dietValues } from '../utils/filter_values';

export const Route = createFileRoute('/sign_up')({
	component: RouteComponent,
});

type ISelections = {
	[K in SignUpSelectionType]: K extends 'diet' ? string : Set<string>;
};

function RouteComponent() {
	const selections: ISelections = {
		diet: '',
		intolerances: new Set(),
		excluded_ingredients: new Set(),
	};

	const handle_radio = (selectedOption: HTMLDivElement, selectionType: SignUpSelectionType) => {
		const form = document.querySelector(`.${styles.sign_up_form}`) as HTMLFormElement;

		const allOptions = form.querySelectorAll(`[data-filter="${selectionType}"]`);
		let input;
		for (const option of allOptions) {
			input = option.querySelector('#radio') as HTMLDivElement;
			if (option === selectedOption) {
				(selections[selectionType] as string) = option.id;
				input.dataset.checked = 'true';
			} else input.dataset.checked = 'false';
		}
	};

	const handle_checkbox = (selectedOption: HTMLDivElement, selectionType: SignUpSelectionType) => {
		const input = selectedOption.querySelector('#checkbox') as HTMLDivElement;
		if (input.dataset.checked === 'false') {
			(selections[selectionType] as Set<string>).add(selectedOption.id);
			input.dataset.checked = 'true';
		} else {
			(selections[selectionType] as Set<string>).delete(selectedOption.id);
			input.dataset.checked = 'false';
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
			case 'excluded_ingredients':
				handle_checkbox(target, filter);
				break;
		}

		console.log(selections);
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
					<form className={styles.sign_up_form} action=''>
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
						<div className={styles.diet}>
							<Dropdown
								filterName='diet'
								options={dietValues}
								inputType='radio'
								handle_input={handle_input}
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
								label_container_styles={{
									border: '1px solid lightgrey',
								}}>
								Intolerances
							</Dropdown>
						</div>
					</form>
				</div>
			</div>
		</div>
	);
}
