import { createFileRoute, redirect } from '@tanstack/react-router';
import SearchFilters from '../components/search_filter/search_filters';
import SearchResultContainer from '../components/search_result_container';
import styles from '../styles/home.module.scss';

export const Route = createFileRoute('/')({
	beforeLoad: ({ context }) => {
		const isLoggedIn = context.isLoggedIn();
		if (!isLoggedIn) {
			throw redirect({
				to: '/sign_up',
			});
		}
	},
	component: Index,
});

function Index() {
	return (
		<div className={styles.container}>
			<SearchFilters />
			<SearchResultContainer />
		</div>
	);
}
