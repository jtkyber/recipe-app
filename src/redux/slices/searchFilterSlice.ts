import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface ISearchFilterState {
	cuisine: string[];
	ingredients: string[];
	type: string[];
	instructionsRequired: boolean;
	maxReadyTime: number;
}

const initialState: ISearchFilterState = {
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
		addCuisine: (state, action: PayloadAction<string>) => {
			state.cuisine = [...state.cuisine, action.payload.toLowerCase()];
		},
		removeCuisine: (state, action: PayloadAction<string>) => {
			const index = state.cuisine.indexOf(action.payload.toLowerCase());
			state.cuisine = state.cuisine.slice(0, index).concat(state.cuisine.slice(index + 1));
		},
		addIngredient: (state, action: PayloadAction<string>) => {
			state.ingredients = [...state.ingredients, action.payload.toLowerCase()];
		},
		removeIngredient: (state, action: PayloadAction<string>) => {
			const index = state.ingredients.indexOf(action.payload.toLowerCase());
			state.ingredients = state.ingredients.slice(0, index).concat(state.ingredients.slice(index + 1));
		},
		addType: (state, action: PayloadAction<string>) => {
			state.type = [...state.type, action.payload.toLowerCase()];
		},
		removeType: (state, action: PayloadAction<string>) => {
			const index = state.type.indexOf(action.payload.toLowerCase());
			state.type = state.type.slice(0, index).concat(state.type.slice(index + 1));
		},
	},
});

export const { addCuisine, removeCuisine, addIngredient, removeIngredient, addType, removeType } =
	searchFilterSlice.actions;
export const selectSearchFilter = (state: RootState) => state.searchFilter;
export type FilterProperties = 'cuisine' | 'ingredients' | 'type' | 'instructionsRequired' | 'maxReadyTime';
export default searchFilterSlice.reducer;
