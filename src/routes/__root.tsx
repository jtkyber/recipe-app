import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import axios from 'axios';
import Navigation from '../components/navigation';
import { setUser } from '../redux/slices/userSlice';
import type { RouterContext } from '../router';
import styles from '../styles/layout.module.scss';
import type { IUser } from '../types/user';

export const Route = createRootRouteWithContext<RouterContext>()({
	loader: async ({ context, location }) => {
		const loggedIn = context.isLoggedIn();
		const cookie = document.cookie;

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
			}
		} else if (location.pathname === '/' && !loggedIn) {
			throw redirect({
				to: '/sign_up',
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
