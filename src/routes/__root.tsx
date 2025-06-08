import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import axios from 'axios';
import Navigation from '../components/navigation';
import { setUser } from '../redux/slices/userSlice';
import type { RouterContext } from '../router';
import styles from '../styles/layout.module.scss';
import type { IUser } from '../types/user';
import { getCookie, setCookie } from '../utils/cookies';

export const Route = createRootRouteWithContext<RouterContext>()({
	loader: async ({ context, location }) => {
		const loggedIn = context.isLoggedIn();
		const cookie = getCookie('id');

		if (!loggedIn && cookie.length) {
			const res = await axios.get('http://localhost:3000/getUser', {
				params: {
					id: cookie,
				},
			});
			const data: IUser = await res.data;
			if (data.id) {
				const dispatch = context.store.dispatch;
				dispatch(setUser(data));
			} else {
				setCookie('id', '', -1);
				throw redirect({
					to: '/login',
				});
			}
		} else if (location.pathname === '/search' && !loggedIn) {
			throw redirect({
				to: '/login',
			});
		}
	},
	component: () => {
		return (
			<div className={styles.container}>
				<Navigation />
				<Outlet />
				<TanStackRouterDevtools />
			</div>
		);
	},
});
