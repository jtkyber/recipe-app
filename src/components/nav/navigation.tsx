import { Link, useRouter, useRouterState } from '@tanstack/react-router';
import { useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { signOutUser } from '../../redux/slices/userSlice';
import styles from '../../styles/nav/navigation.module.scss';
import type { IUser } from '../../types/user';
import { setCookie } from '../../utils/cookies';
import HeartNavSVG from '../svg/heart_navSVG';
import ProfileSVG from '../svg/profileSVG';
import SearchSVG from '../svg/searchSVG';
import NavDropdown from './nav_dropdown';

function Navigation() {
	const user: IUser = useAppSelector(state => state.user);
	const dispatch = useAppDispatch();

	const routerState = useRouterState();
	const router = useRouter();

	const iconRef = useRef<HTMLDivElement>(null);

	const routeId = routerState.matches[routerState.matches.length - 1]?.routeId;

	const sign_user_out = () => {
		dispatch(signOutUser());
		setCookie('id', '', -1);
		router.navigate({ to: '/login' });
	};

	return (
		<nav className={styles.container}>
			<div className={styles.left}>
				<Link to='/'>
					<h2 className={styles.title}>RecipeMe</h2>
				</Link>
			</div>
			<div className={styles.right}>
				{user.id ? (
					<>
						<Link
							to='/search'
							className={`${styles.nav_icon_container} ${routeId === '/search' ? styles.active : null}`}>
							<SearchSVG />
						</Link>

						<Link
							to='/saved'
							className={`${styles.nav_icon_container} ${routeId === '/saved' ? styles.active : null}`}>
							<HeartNavSVG />
						</Link>

						<div
							className={`${styles.nav_icon_container} ${routeId === '/profile' ? styles.active : null}`}
							ref={iconRef}>
							<ProfileSVG />
						</div>
						<NavDropdown iconRef={iconRef}>
							<Link className={styles.profile_link} to='/profile'>
								<div className={styles.profile_container}>
									<h4 className={styles.username}>{user.username}</h4>
									<h5 className={styles.edit_profile_text}>Edit Profile</h5>
								</div>
							</Link>
							<h5 onClick={sign_user_out}>Sign Out</h5>
						</NavDropdown>
					</>
				) : (
					<Link to='/login'>
						<h4>Log In</h4>
					</Link>
				)}
			</div>
		</nav>
	);
}

export default Navigation;
