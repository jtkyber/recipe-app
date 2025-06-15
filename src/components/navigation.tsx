import { Link, useRouterState } from '@tanstack/react-router';
import heartImg from '../assets/heart.png';
import profileImg from '../assets/profile.png';
import { useAppSelector } from '../redux/hooks';
import styles from '../styles/navigation.module.scss';
import type { IUser } from '../types/user';
import SearchSVG from './svg/searchSVG';

function Navigation() {
	const user: IUser = useAppSelector(state => state.user);
	const routerState = useRouterState();

	const routeId = routerState.matches[routerState.matches.length - 1]?.routeId;

	return (
		<nav className={styles.container}>
			<div className={styles.left}>
				<Link to='/'>
					<h2>Recipe App</h2>
				</Link>
			</div>
			<div className={styles.right}>
				{routeId === '/' ? (
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
						<Link to='/login'>
							<h4>Log In</h4>
						</Link>
					)
				) : routeId === '/search' ? (
					<>
						<Link to='/saved'>
							<img className={styles.heartImg} src={heartImg} alt='Heart Image' />
						</Link>

						<Link to='/profile'>
							<img className={styles.profileImg} src={profileImg} alt='Profile Image' />
						</Link>
					</>
				) : routeId === '/recipes/$id' ? (
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
						<Link to='/login'>
							<h4>Log In</h4>
						</Link>
					)
				) : routeId === '/saved' ? (
					<>
						<Link to='/search'>
							<SearchSVG />
						</Link>
						<Link to='/profile'>
							<img className={styles.profileImg} src={profileImg} alt='Profile Image' />
						</Link>
					</>
				) : routeId === '/profile' ? (
					<>
						<Link to='/search'>
							<SearchSVG />
						</Link>
						<Link to='/saved'>
							<img className={styles.heartImg} src={heartImg} alt='Heart Image' />
						</Link>
					</>
				) : routeId === '/login' ? null : null}
			</div>
		</nav>
	);
}

export default Navigation;
