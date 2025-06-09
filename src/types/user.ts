export interface IUser {
	id: number;
	username: string;
	diet: string;
	intolerances: string[];
	excludedIngredients: string[];
	savedRecipes: number[];
}
