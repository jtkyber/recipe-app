import { configureStore } from '@reduxjs/toolkit';
import searchFilterReducer from './slices/searchFilterSlice';

export const store = configureStore({
	reducer: {
		test: searchFilterReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
