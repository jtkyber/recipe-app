import type { FormEventHandler, InputHTMLAttributes } from 'react';
import styles from '../styles/auth/login_input.module.scss';

type StyleKeys = keyof typeof styles;

function LoginInput({ className, inputAttr }: { className: StyleKeys; inputAttr: InputHTMLAttributes<any> }) {
	const handle_form_change: FormEventHandler<HTMLInputElement> = e => {
		const target = e.target;
		if (target instanceof HTMLInputElement) {
			if (target.value) {
				target.classList.add(styles.has_text);
			} else {
				target.classList.remove(styles.has_text);
			}
		}
	};

	return (
		<div className={`${styles.container} ${styles[className]}`}>
			<input onInput={handle_form_change} {...inputAttr} />
		</div>
	);
}

export default LoginInput;
