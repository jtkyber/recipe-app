export interface ISearchFilterState {
	sortType: string;
	query: string;
	cuisine: string[];
	ingredients: string[];
	type: string[];
	instructionsRequired: boolean;
	maxReadyTime: number;
	count: number;
	page: number;
	ignoreProfileFilters: boolean;
}

export type FilterProperty =
	| 'sortType'
	| 'cuisine'
	| 'ingredients'
	| 'type'
	| 'instructionsRequired'
	| 'maxReadyTime'
	| 'ignoreProfileFilters';
