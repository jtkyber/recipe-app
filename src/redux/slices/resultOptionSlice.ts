import { createSlice } from '@reduxjs/toolkit';
import type { RootState } from '../store';

interface IResultOptionState {
	view: 'grid' | 'list';
}

const initialState: IResultOptionState = {
	view: 'grid',
};

export const resultOptionSlice = createSlice({
	name: 'resultOptions',
	initialState,
	reducers: {
		toggleView: state => {
			state.view = state.view === 'grid' ? 'list' : 'grid';
		},
	},
});

export const { toggleView } = resultOptionSlice.actions;
export const selectResultOptions = (state: RootState) => state.resultsOptions;
export default resultOptionSlice.reducer;
