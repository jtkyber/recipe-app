export interface ISearchFilterState {
	query: string;
	cuisine: string[];
	ingredients: string[];
	type: string[];
	instructionsRequired: boolean;
	maxReadyTime: number;
}
