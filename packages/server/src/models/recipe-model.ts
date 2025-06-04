export interface ChefReference {
    name: string;
    href: string;
}

export interface CuisineReference {
    name: string;
    href: string;
}

export interface IngredientReference {
    name: string;
    href: string;
}

export interface MealPlanReference {
    name: string;
    href: string;
}

export interface RecipeData {
    idName: string;
    name: string;
    description: string;
    imageUrl: string;
    cookingTime: string;
    servingSize: string;
    difficulty: string;
    chef: ChefReference;
    cuisine: CuisineReference;
    ingredients: IngredientReference[];
    mealPlans: MealPlanReference[];
    steps: string[];
}