import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface ISearchFilterState {
	query: string;
	cuisine: string[];
	ingredients: string[];
	type: string[];
	instructionsRequired: boolean;
	maxReadyTime: number;
	count: number;
	page: number;
}

const initialState: ISearchFilterState = {
	query: '',
	cuisine: [],
	ingredients: [],
	type: [],
	instructionsRequired: true,
	maxReadyTime: 60,
	count: 10,
	page: 0,
};

export const searchFilterSlice = createSlice({
	name: 'searchFilter',
	initialState,
	reducers: {
		setQuery: (state, action: PayloadAction<string>) => {
			state.query = action.payload;
			state.page = 0;
		},
		addCuisine: (state, action: PayloadAction<string>) => {
			state.cuisine = [...state.cuisine, action.payload];
			state.page = 0;
		},
		removeCuisine: (state, action: PayloadAction<string>) => {
			const index = state.cuisine.indexOf(action.payload);
			state.cuisine = state.cuisine.slice(0, index).concat(state.cuisine.slice(index + 1));
			state.page = 0;
		},
		addIngredient: (state, action: PayloadAction<string>) => {
			state.ingredients = [...state.ingredients, action.payload];
			state.page = 0;
		},
		removeIngredient: (state, action: PayloadAction<string>) => {
			const index = state.ingredients.indexOf(action.payload);
			state.ingredients = state.ingredients.slice(0, index).concat(state.ingredients.slice(index + 1));
			state.page = 0;
		},
		addType: (state, action: PayloadAction<string>) => {
			state.type = [...state.type, action.payload];
			state.page = 0;
		},
		removeType: (state, action: PayloadAction<string>) => {
			const index = state.type.indexOf(action.payload);
			state.type = state.type.slice(0, index).concat(state.type.slice(index + 1));
			state.page = 0;
		},
		toggleInstructionsRequired: state => {
			state.instructionsRequired = state.instructionsRequired ? false : true;
			state.page = 0;
		},
		setMaxReadyTime: (state, action: PayloadAction<number>) => {
			state.maxReadyTime = action.payload;
			state.page = 0;
		},
		setPage: (state, action: PayloadAction<number>) => {
			state.page = action.payload;
		},
	},
});

export const {
	setQuery,
	addCuisine,
	removeCuisine,
	addIngredient,
	removeIngredient,
	addType,
	removeType,
	toggleInstructionsRequired,
	setMaxReadyTime,
	setPage,
} = searchFilterSlice.actions;
export const selectSearchFilter = (state: RootState) => state.searchFilter;
export type FilterProperty = 'cuisine' | 'ingredients' | 'type' | 'instructionsRequired' | 'maxReadyTime';
export default searchFilterSlice.reducer;
