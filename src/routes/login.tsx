import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import LoginForm from '../components/login_form';
import SignupForm from '../components/signup_form';
import styles from '../styles/auth/login.module.scss';

export const Route = createFileRoute('/login')({
	component: RouteComponent,
});

function RouteComponent() {
	const [action, setAction] = useState<'login' | 'signup'>('login');

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
					{action === 'signup' ? (
						<>
							<header>
								<h1>Join Recipe App</h1>
								<p>
									Already have an account?<a onClick={() => setAction('login')}>Login</a>
								</p>
							</header>
							<SignupForm />
						</>
					) : (
						<>
							<header>
								<h1>Login</h1>
								<p>
									Don't have an account?<a onClick={() => setAction('signup')}>Sign Up</a>
								</p>
							</header>
							<LoginForm />
						</>
					)}
				</div>
			</div>
		</div>
	);
}
