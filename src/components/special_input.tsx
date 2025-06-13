import { createRef, useEffect, type FormEventHandler, type InputHTMLAttributes } from 'react';
import styles from '../styles/auth/login_input.module.scss';

function SpecialInput({
	placeholder,
	inputAttr,
	value,
}: {
	placeholder: string;
	inputAttr: InputHTMLAttributes<any>;
	value?: string;
}) {
	const containerRef = createRef<HTMLDivElement>();
	const inputRef = createRef<HTMLInputElement>();

	useEffect(() => {
		const container = containerRef.current;
		const input = inputRef.current;

		if (container) container.setAttribute('data-after', placeholder);
		if (input && value) {
			input.value = value;
			input.classList.add(styles.has_text);
		}
	}, []);

	const handle_form_change: FormEventHandler<HTMLInputElement> = () => {
		const input = inputRef.current;
		if (!input) return;

		if (input.value) input.classList.add(styles.has_text);
		else input.classList.remove(styles.has_text);
	};

	return (
		<div ref={containerRef} className={styles.container}>
			<input ref={inputRef} onInput={handle_form_change} {...inputAttr} />
			<div className={styles.placeholder}>{placeholder}</div>
		</div>
	);
}

export default SpecialInput;
