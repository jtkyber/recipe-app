export interface IIngredient {
	id: number;
	image: string;
	localizedName: string;
	name: string;
}

export interface IRecipeInstructionStep {
	equipment: any;
	ingredients: IIngredient[];
	number: number;
	step: string;
}

export interface IRecipeInstruction {
	name: string;
	steps: IRecipeInstructionStep[];
}

export interface IMeasure {
	amount: number;
	unitLong: string;
	unitShort: string;
}

export interface IMeasures {
	metric: IMeasure;
	us: IMeasure;
}

export interface IExtendedIngredientsItem {
	aisle: string;
	amount: number;
	consistency: string;
	id: number;
	image: any;
	measures: IMeasures;
	meta: any;
	name: string;
	nameClean: string;
	original: string;
	originalName: string;
	unit: string;
}

export interface IRecipe {
	aggregateLikes: number;
	instructions: string;
	analyzedInstructions: IRecipeInstruction[];
	extendedIngredients: IExtendedIngredientsItem[];
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
	shortSummary?: string;
	sustainable: boolean;
	title: string;
	vegan: boolean;
	vegetarian: boolean;
	veryHealthy: boolean;
	veryPopular: boolean;
	weightWatcherSmartPoints: number;
}
export interface ISearchResult {
	number: number;
	offset: number;
	results: IRecipe[];
	totalResults: number;
	pointsRemaining: number;
	pointsSpentThisRequest: number;
}

export interface IAutocompleteIngredient {
	name: 'string';
	image: 'string';
}
