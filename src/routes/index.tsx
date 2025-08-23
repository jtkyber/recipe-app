import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import styles from '../styles/index.module.scss';

export const Route = createFileRoute('/')({
	component: Index,
});

function Index() {
	const navigate = useNavigate();

	useEffect(() => {
		navigate({ to: '/search' });
	}, []);

	return (
		<div className={styles.container}>
			<h3>Landing page</h3>
		</div>
	);
}
