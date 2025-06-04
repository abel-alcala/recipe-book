export interface RecipeReference {
    name: string;
    href: string;
    day?: string;
    mealType?: string;
}

export interface MealPlanData {
    idName: string;
    name: string;
    duration: string;
    purpose: string;
    mealTypes: string[];
    recipes: RecipeReference[];
}