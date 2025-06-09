import Dexie, { type EntityTable } from 'dexie';
import type { IRecipe } from './types/recipe';

const db = new Dexie('RecipeDatabase') as Dexie & {
	savedRecipes: EntityTable<IRecipe, 'id'>;
};

db.version(1).stores({
	savedRecipes: '++id',
});

export { db };
