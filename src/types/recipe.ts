export interface IIngredient {
	id: number;
	image: string;
	localizedName: string;
	name: string;
}

export interface IRecipeInstructionStep {
	equipment: string[];
	ingredients: IIngredient[];
	number: number;
	step: string;
}

export interface IRecipeInstruction {
	name: string;
	steps: IRecipeInstructionStep[];
}

export interface IRecipe {
	aggregateLikes: number;
	analyzedInstructions: IRecipeInstruction[];
	cheap: boolean;
	creditsText: string;
	cuisines: string[];
	dairyFree: boolean;
	diets: string[];
	dishTypes: string[];
	gaps: string;
	glutenFree: boolean;
	healthScore: number;
	id: number;
	image: string;
	imageType: string;
	lowFodmap: boolean;
	occasions: string[];
	pricePerServing: number;
	readyInMinutes: number;
	servings: number;
	sourceName: string;
	sourceUrl: string;
	spoonacularScore: number;
	spoonacularSourceUrl: string;
	summary: string;
	sustainable: boolean;
	title: string;
	vegan: boolean;
	vegetarian: boolean;
	veryHealthy: boolean;
	veryPolular: boolean;
	weightWatchersSmartPoints: number;
}
