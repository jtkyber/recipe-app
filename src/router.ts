import type { EnhancedStore } from '@reduxjs/toolkit';
import { createRouter } from '@tanstack/react-router';
import store from './redux/store';
import { routeTree } from './routeTree.gen';
import type { IUser } from './types/user';

export interface RouterContext {
	getUserData: () => IUser;
	isLoggedIn: () => boolean;
	store: EnhancedStore;
}

const getUserData = () => store.getState().user;
const isLoggedIn = () => store.getState().user.id > 0;

export const router = createRouter({
	routeTree,
	context: {
		getUserData,
		isLoggedIn,
		store: store,
	},
});

declare module '@tanstack/react-router' {
	interface Register {
		router: typeof router;
	}
}
