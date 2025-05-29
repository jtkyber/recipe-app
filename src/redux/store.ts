import { configureStore } from '@reduxjs/toolkit';
import resultOptionsReducer from './slices/resultOptionSlice';
import searchFilterReducer from './slices/searchFilterSlice';

export const store = configureStore({
	reducer: {
		searchFilter: searchFilterReducer,
		resultsOptions: resultOptionsReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
