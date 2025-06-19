import { useEffect, useRef, useState, type ReactElement } from 'react';
import styles from '../../styles/nav/nav_dropdown.module.scss';
import type { NavIcons } from '../../types/nav';
import ProfileSVG from '../svg/profileSVG';

function NavDropdown({ children, iconName }: { children: ReactElement[]; iconName: NavIcons }) {
	const iconRef = useRef<HTMLDivElement>(null);
	const contentsRef = useRef<HTMLDivElement>(null);

	const [position, setPosition] = useState<{
		left: number;
	}>();

	function adjust_position() {
		const icon = iconRef?.current;
		const contents = contentsRef?.current;
		if (!(icon && contents)) return;

		setPosition({
			left: icon.getBoundingClientRect().right - contents.getBoundingClientRect().width,
		});
	}

	useEffect(() => {
		const contents = contentsRef?.current;
		if (!contents) return;

		contents.style.display = 'none';

		document.addEventListener('click', handle_click);
		window.addEventListener('resize', adjust_position);

		return () => {
			document.removeEventListener('click', handle_click);
			window.removeEventListener('resize', adjust_position);
		};
	}, []);

	function handle_click(e: MouseEvent) {
		if (!contentsRef?.current) return;

		const display = contentsRef.current.style.display;

		const target = e.target as HTMLElement;
		if (target === iconRef.current) {
			contentsRef.current.style.display = display === 'none' ? 'flex' : 'none';
		} else {
			contentsRef.current.style.display = 'none';
		}
		adjust_position();
	}

	return (
		<>
			<div ref={iconRef} className={styles.icon_container}>
				{iconName === 'profile' ? <ProfileSVG /> : null}
			</div>
			<div style={position} ref={contentsRef} className={styles.contents}>
				{children.map((child, index) => (
					<div key={index} className={styles.setting_text}>
						{child}
					</div>
				))}
			</div>
		</>
	);
}

export default NavDropdown;
