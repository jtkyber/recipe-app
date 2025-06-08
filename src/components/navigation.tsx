import { Link, useRouter } from '@tanstack/react-router';
import heartImg from '../assets/heart.png';
import profileImg from '../assets/profile.png';
import { useAppSelector } from '../redux/hooks';
import styles from '../styles/navigation.module.scss';
import type { IUser } from '../types/user';

function Navigation() {
	const user: IUser = useAppSelector(state => state.user);
	const router = useRouter();

	return (
		<nav className={styles.container}>
			<div className={styles.left}>
				<h2>Recipe App</h2>
			</div>
			{router.latestLocation.pathname === '/' || router.latestLocation.pathname === '/search' ? (
				<div className={styles.right}>
					{user.id ? (
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
					)}
				</div>
			) : router.latestLocation.pathname === '/sign_up' ? null : null}
		</nav>
	);
}

export default Navigation;
