import { configureStore } from '@reduxjs/toolkit';
import searchFilterReducer from './slices/searchFilterSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
	reducer: {
		user: userReducer,
		searchFilter: searchFilterReducer,
	},
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
