import { createFileRoute } from '@tanstack/react-router';
import SearchFilters from '../components/search_filter/search_filters';
import SearchResultContainer from '../components/search_results/search_result_container';
import styles from '../styles/search_page.module.scss';

export const Route = createFileRoute('/search')({
	component: RouteComponent,
});

function RouteComponent() {
	// const [filters, setFilters] = useState<ISearchFilterState>({
	// 	query: '',
	// 	cuisine: [],
	// 	ingredients: [],
	// 	type: [],
	// 	instructionsRequired: true,
	// 	maxReadyTime: 60,
	// });

	return (
		<div className={styles.container}>
			<SearchFilters />
			<SearchResultContainer />
		</div>
	);
}
