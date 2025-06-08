import { createFileRoute } from '@tanstack/react-router';
import styles from '../styles/index.module.scss';

export const Route = createFileRoute('/')({
	component: Index,
});

function Index() {
	return (
		<div className={styles.container}>
			<h3>Landing page</h3>
		</div>
	);
}
