import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { IUser } from '../../types/user';
import type { RootState } from '../store';

const initialState: IUser = {
	id: 0,
	username: '',
	diet: '',
	intolerances: [],
	excludedIngredients: [],
};

export const userSlice = createSlice({
	name: 'user',
	initialState,
	reducers: {
		setUser: (state, action: PayloadAction<IUser>) => {
			state.username = action.payload.username;
			state.diet = action.payload.diet;
			state.intolerances = action.payload.intolerances;
			state.excludedIngredients = action.payload.excludedIngredients;
		},
	},
});

export const { setUser } = userSlice.actions;
export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
