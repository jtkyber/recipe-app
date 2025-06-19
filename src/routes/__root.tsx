import { createRootRouteWithContext, Outlet, redirect } from '@tanstack/react-router';
import axios from 'axios';
import Navigation from '../components//nav/navigation';
import { setUser } from '../redux/slices/userSlice';
import { router, type RouterContext } from '../router';
import styles from '../styles/layout.module.scss';
import type { IUser } from '../types/user';
import { getCookie, setCookie } from '../utils/cookies';

export const Route = createRootRouteWithContext<RouterContext>()({
	loader: async ({ context, location }) => {
		const loggedIn = context.isLoggedIn();
		const cookie = getCookie('id');

		type AllRoutesObject = typeof router.routesByPath;
		type FilePath = keyof AllRoutesObject;

		const pathname = location.pathname as FilePath;
		const loggedInOnlyRoutes: FilePath[] = ['/search', '/saved', '/profile'];

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
			} else if (loggedInOnlyRoutes.includes(pathname)) {
				setCookie('id', '', -1);
				throw redirect({
					to: '/login',
				});
			}
		} else if (!loggedIn && loggedInOnlyRoutes.includes(pathname)) {
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
				{/* <TanStackRouterDevtools /> */}
			</div>
		);
	},
});
