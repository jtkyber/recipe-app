import { createFileRoute } from '@tanstack/react-router';
import SearchFilters from '../components/search_filter/search_filters';
import SearchResultContainer from '../components/search_results/search_result_container';
import styles from '../styles/home.module.scss';

export const Route = createFileRoute('/')({
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
