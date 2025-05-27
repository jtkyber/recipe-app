import { createFileRoute } from '@tanstack/react-router';
import styles from '../styles/sign_up.module.scss';

export const Route = createFileRoute('/sign_up')({
	component: RouteComponent,
});

function RouteComponent() {
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
					<div className={styles.password}>
						<input type='password' required />
					</div>
					<div className={styles.confirm_password}>
						<input type='password' required />
					</div>
				</form>
			</div>
		</div>
	);
}
