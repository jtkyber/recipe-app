import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { addIngredient, type FilterProperty } from '../../redux/slices/searchFilterSlice';
import styles from '../../styles/search_filter/autocompleteDropdown.module.scss';
import optionStyles from '../../styles/search_filter/filter_option.module.scss';
import { get_parent_with_class_name } from '../../utils/dom_tools';

function AutocompleteDropdown({ activeTextbox }: { activeTextbox: HTMLInputElement }) {
	const dispatch = useAppDispatch();
	const filters = useAppSelector(state => state.searchFilter);
	const [filter, setFilter] = useState<string[]>([]);

	useEffect(set_current_filter, [activeTextbox]);

	function set_current_filter() {
		const optionElement = get_parent_with_class_name(activeTextbox, optionStyles.option);
		const filterName = optionElement?.dataset.filter as FilterProperty;
		const filterTemp = filters[filterName];
		if (Array.isArray(filterTemp)) setFilter(filterTemp);
	}

	const { data, fetchStatus } = useQuery<{ name: string; image: string }[]>({
		queryKey: ['autocomplete'],
		queryFn: () => {
			throw new Error('This queryFn should not be called');
		},
		enabled: false,
	});

	const handle_option_click: React.MouseEventHandler = e => {
		const option = (e.target as HTMLHeadingElement).id;
		dispatch(addIngredient(option));
	};

	return (
		<div
			style={{
				top: activeTextbox.getBoundingClientRect().y + activeTextbox.getBoundingClientRect().height,
				left: activeTextbox.getBoundingClientRect().x,
				width: activeTextbox.getBoundingClientRect().width,
			}}
			className={styles.container}>
			{fetchStatus === 'idle'
				? data
						?.filter(d => !filter.includes(d.name))
						.map(option => {
							const { name } = option;
							return (
								<h5 id={name} onMouseDown={handle_option_click} key={name}>
									{name}
								</h5>
							);
						})
				: null}
		</div>
	);
}

export default AutocompleteDropdown;
