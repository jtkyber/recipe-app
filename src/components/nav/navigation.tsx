import { Link, useRouter, useRouterState } from '@tanstack/react-router';
import heartImg from '../../assets/heart.png';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { signOutUser } from '../../redux/slices/userSlice';
import styles from '../../styles/nav/navigation.module.scss';
import type { IUser } from '../../types/user';
import { setCookie } from '../../utils/cookies';
import SearchSVG from '../svg/searchSVG';
import NavDropdown from './nav_dropdown';

function Navigation() {
	const user: IUser = useAppSelector(state => state.user);
	const dispatch = useAppDispatch();
	const routerState = useRouterState();
	const router = useRouter();

	const routeId = routerState.matches[routerState.matches.length - 1]?.routeId;

	const sign_user_out = () => {
		dispatch(signOutUser());
		setCookie('id', '', -1);
		router.navigate({ to: '/login' });
	};

	const render_profile_dropdown = () => (
		<NavDropdown iconName='profile'>
			<Link to='/profile'>
				<div className={styles.profile_container}>
					<h4 className={styles.username}>{user.username}</h4>
					<h5 className={styles.edit_profile_text}>Edit Profile</h5>
				</div>
			</Link>
			<h5 onClick={sign_user_out}>Sign Out</h5>
		</NavDropdown>
	);

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
							<Link to='/search'>
								<SearchSVG />
							</Link>
							<Link to='/saved'>
								<img className={styles.heartImg} src={heartImg} alt='Heart Image' />
							</Link>

							{render_profile_dropdown()}
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

						{render_profile_dropdown()}
					</>
				) : routeId === '/recipes/$id' ? (
					user.id ? (
						<>
							<Link to='/saved'>
								<img className={styles.heartImg} src={heartImg} alt='Heart Image' />
							</Link>

							{render_profile_dropdown()}
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
						{render_profile_dropdown()}
					</>
				) : routeId === '/profile' ? (
					<>
						<Link to='/search'>
							<SearchSVG />
						</Link>
						<Link to='/saved'>
							<img className={styles.heartImg} src={heartImg} alt='Heart Image' />
						</Link>
						{render_profile_dropdown()}
					</>
				) : routeId === '/login' ? null : null}
			</div>
		</nav>
	);
}

export default Navigation;
