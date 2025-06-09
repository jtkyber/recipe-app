import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IUser } from '../../types/user';
import type { RootState } from '../store';

const initialState: IUser = {
	id: 0,
	username: '',
	diet: '',
	intolerances: [],
	excludedIngredients: [],
	savedRecipes: [],
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<IUser>) => {
			state.id = action.payload.id;
			state.username = action.payload.username;
			state.diet = action.payload.diet;
			state.intolerances = action.payload.intolerances;
			state.excludedIngredients = action.payload.excludedIngredients;
			state.savedRecipes = action.payload.savedRecipes;
		},
		setSavedRecipes: (state, action: PayloadAction<number[]>) => {
			state.savedRecipes = action.payload;
		},
	},
});

export const { setUser, setSavedRecipes } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
