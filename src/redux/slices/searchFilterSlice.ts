import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface ISearchFilterState {
	test: number;
}

const initialState: ISearchFilterState = {
	test: 0,
};

export const searchFilterSlice = createSlice({
	name: 'searchFilter',
	initialState,
	reducers: {
		setTest: (state, action: PayloadAction<number>) => {
			state.test = action.payload;
		},
	},
});

export const { setTest } = searchFilterSlice.actions;
export const selectTest = (state: RootState) => state.test;
export default searchFilterSlice.reducer;
