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
}

const initialState: ISearchFilterState = {
	query: '',
	cuisine: [],
	ingredients: [],
	type: [],
	instructionsRequired: true,
	maxReadyTime: 60,
};

export const searchFilterSlice = createSlice({
	name: 'searchFilter',
	initialState,
	reducers: {
		setQuery: (state, action: PayloadAction<string>) => {
			state.query = action.payload;
		},
		addCuisine: (state, action: PayloadAction<string>) => {
			state.cuisine = [...state.cuisine, action.payload];
		},
		removeCuisine: (state, action: PayloadAction<string>) => {
			const index = state.cuisine.indexOf(action.payload);
			state.cuisine = state.cuisine.slice(0, index).concat(state.cuisine.slice(index + 1));
		},
		addIngredient: (state, action: PayloadAction<string>) => {
			state.ingredients = [...state.ingredients, action.payload];
		},
		removeIngredient: (state, action: PayloadAction<string>) => {
			const index = state.ingredients.indexOf(action.payload);
			state.ingredients = state.ingredients.slice(0, index).concat(state.ingredients.slice(index + 1));
		},
		addType: (state, action: PayloadAction<string>) => {
			state.type = [...state.type, action.payload];
		},
		removeType: (state, action: PayloadAction<string>) => {
			const index = state.type.indexOf(action.payload);
			state.type = state.type.slice(0, index).concat(state.type.slice(index + 1));
		},
		toggleInstructionsRequired: state => {
			state.instructionsRequired = state.instructionsRequired ? false : true;
		},
		setMaxReadyTime: (state, action: PayloadAction<number>) => {
			state.maxReadyTime = action.payload;
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
} = searchFilterSlice.actions;
export const selectSearchFilter = (state: RootState) => state.searchFilter;
export type FilterProperty = 'cuisine' | 'ingredients' | 'type' | 'instructionsRequired' | 'maxReadyTime';
export default searchFilterSlice.reducer;
