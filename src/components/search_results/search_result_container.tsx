import { useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { setPage } from '../../redux/slices/searchFilterSlice';
import styles from '../../styles/search_results/search_result_container.module.scss';
import type { IRecipe, ISearchResult } from '../../types/recipe';
import RecipeResultSkeleton from '../skeletons/recipe_result_skeleton';
import SearchResult from './search_result';

function SearchResultContainer() {
	const dispatch = useAppDispatch();
	const filters = useAppSelector(state => state.searchFilter);

	const [pageBtns, setPageBtns] = useState<number[]>([]);
	const [pageCount, setPageCount] = useState<number>(0);
	const [showNextBtn, setShowNextBtn] = useState<boolean>(false);

	const containerRef = useRef<HTMLDivElement>(null);

	const { data, fetchStatus } = useQuery<ISearchResult, Error>({
		queryKey: ['recipes', filters],
		queryFn: () => {
			throw new Error('This queryFn should not be called');
		},
		enabled: false,
	});

	const set_page_buttons = () => {
		const MAX_BTN_COUNT = 5;
		const HALF_MAX_BTN_COUNT = Math.ceil(MAX_BTN_COUNT / 2);

		if (!data?.totalResults) {
			setPageCount(0);
			setPageBtns([]);
			return;
		}

		const totalPages = Math.ceil(data?.totalResults / filters.count);

		let startingNum = filters.page >= HALF_MAX_BTN_COUNT ? filters.page - HALF_MAX_BTN_COUNT + 1 : 0;

		if (totalPages < MAX_BTN_COUNT) {
			setShowNextBtn(false);
		} else if (totalPages >= MAX_BTN_COUNT && filters.page >= totalPages - HALF_MAX_BTN_COUNT) {
			startingNum = totalPages - MAX_BTN_COUNT;
			setShowNextBtn(false);
		} else setShowNextBtn(true);

		const temp = Array.from(
			{ length: Math.min(totalPages, MAX_BTN_COUNT) },
			(_, index) => startingNum + index
		);

		setPageCount(totalPages);
		setPageBtns(temp);
	};

	useEffect(() => set_page_buttons(), [data]);

	useEffect(() => {
		const container = containerRef?.current;
		if (!container) return;

		container.scrollTop = 0;
	}, [filters.page]);

	const handle_page_change = (page: number) => dispatch(setPage(page));

	return (
		<div ref={containerRef} className={styles.container}>
			<div className={styles.options}></div>
			<div className={styles.total_results_text_container}>
				<h4 className={styles.total_results_text}>
					<span className={styles.result_count}>
						{fetchStatus === 'idle' ? data?.totalResults : 'searching...'}
					</span>{' '}
					{fetchStatus === 'idle' ? 'results' : ''}
				</h4>
			</div>
			<div className={styles.results}>
				{fetchStatus === 'idle'
					? data?.results.map((recipe: IRecipe) => {
							return <SearchResult key={recipe.id} recipe={recipe} />;
						})
					: Array.from({ length: filters.count }, (_, index) => <RecipeResultSkeleton key={index} />)}
			</div>
			{pageCount > 1 ? (
				<footer className={styles.pagination}>
					{pageBtns[0] > 0 ? (
						<button onClick={() => handle_page_change(filters.page - 1)} className={styles.side_btns}>
							<span className={styles.arrow}>&lsaquo;</span>
							{/* <span className={styles.text}>Prev</span> */}
						</button>
					) : null}
					{pageBtns.map(page => {
						return (
							<button
								onClick={() => handle_page_change(page)}
								key={page}
								className={`${styles.pagination_btn} ${page === filters.page ? styles.active : null}`}>
								{page + 1}
							</button>
						);
					})}
					{showNextBtn ? (
						<button onClick={() => handle_page_change(filters.page + 1)} className={styles.side_btns}>
							{/* <span className={styles.text}>Next</span> */}
							<span className={styles.arrow}>&rsaquo;</span>
						</button>
					) : null}
				</footer>
			) : null}
		</div>
	);
}

export default SearchResultContainer;
