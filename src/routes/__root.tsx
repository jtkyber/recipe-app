import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Navigation from '../components/navigation';
import type { RouterContext } from '../router';
import styles from '../styles/layout.module.scss';

export const Route = createRootRouteWithContext<RouterContext>()({
	component: () => (
		<div className={styles.container}>
			<Navigation />
			<Outlet />
			<TanStackRouterDevtools />
		</div>
	),
});
