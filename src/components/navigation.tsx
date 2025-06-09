import { Link, useRouterState } from '@tanstack/react-router';
import heartImg from '../assets/heart.png';
import profileImg from '../assets/profile.png';
import { useAppSelector } from '../redux/hooks';
import styles from '../styles/navigation.module.scss';
import type { IUser } from '../types/user';

function Navigation() {
	const user: IUser = useAppSelector(state => state.user);
	const routerState = useRouterState();

	const routeId = routerState.matches[routerState.matches.length - 1]?.routeId;

	return (
		<nav className={styles.container}>
			<div className={styles.left}>
				<h2>Recipe App</h2>
			</div>
			<div className={styles.right}>
				{['/', '/search', '/recipes/$id'].includes(routeId) ? (
					user.id ? (
						<>
							<Link to='/saved'>
								<img className={styles.heartImg} src={heartImg} alt='Heart Image' />
							</Link>

							<Link to='/profile'>
								<img className={styles.profileImg} src={profileImg} alt='Profile Image' />
							</Link>
						</>
					) : (
						<h3>Log In</h3>
					)
				) : routeId === '/saved' ? (
					<Link to='/profile'>
						<img className={styles.profileImg} src={profileImg} alt='Profile Image' />
					</Link>
				) : routeId === '/login' ? null : null}
			</div>
		</nav>
	);
}

export default Navigation;
