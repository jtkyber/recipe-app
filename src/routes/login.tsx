import { useQueryClient } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import LoginForm from '../components/login_form';
import SignupForm from '../components/signup_form';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { resetFilters } from '../redux/slices/searchFilterSlice';
import styles from '../styles/auth/login.module.scss';

export const Route = createFileRoute('/login')({
	component: RouteComponent,
});

function RouteComponent() {
	const dispatch = useAppDispatch();
	const user = useAppSelector(state => state.user);
	const [action, setAction] = useState<'login' | 'signup'>('login');

	const queryClient = useQueryClient();

	useEffect(() => {
		dispatch(resetFilters());
		queryClient.resetQueries();
	}, [user.id]);

	return (
		<div className={styles.container}>
			<div className={styles.left_container}>
				<div className={styles.text_container}>
					<h2>{`Search Less, \nCook More`}</h2>
					<p>Effortlessly find delicious meals that match your dietary needs</p>
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
