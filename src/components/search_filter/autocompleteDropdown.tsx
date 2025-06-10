import { createRef, useEffect, useState, type MouseEventHandler } from 'react';
import styles from '../../styles/search_filter/autocompleteDropdown.module.scss';

function AutocompleteDropdown({
	options,
	activeTextbox,
	handle_autocomplete_click,
	selected,
}: {
	options: string[];
	activeTextbox: HTMLInputElement;
	handle_autocomplete_click: MouseEventHandler;
	selected: string[];
}) {
	const container_ref = createRef<HTMLDivElement>();
	const [position, setPosition] = useState<{
		top: number;
		left: number;
		width: number;
	}>();

	useEffect(() => {
		adjust_position();

		window.addEventListener('scroll', adjust_position, true);

		return () => {
			window.removeEventListener('scroll', adjust_position, true);
		};
	}, []);

	function adjust_position() {
		setPosition({
			top: activeTextbox.getBoundingClientRect().y + activeTextbox.getBoundingClientRect().height,
			left: activeTextbox.getBoundingClientRect().x,
			width: activeTextbox.getBoundingClientRect().width,
		});
	}

	return position ? (
		<div ref={container_ref} style={position} className={styles.container}>
			{options
				.filter(o => !selected.includes(o))
				.map(name => {
					return (
						<h5 id={name} onMouseDown={handle_autocomplete_click} key={name}>
							{name}
						</h5>
					);
				})}
		</div>
	) : null;
}

export default AutocompleteDropdown;
