import { createRootRoute, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Navigation from '../components/navigation';
import styles from '../styles/layout.module.scss';

export const Route = createRootRoute({
	component: () => (
		<div className={styles.container}>
			<Navigation />
			<Outlet />
			<TanStackRouterDevtools />
		</div>
	),
});
