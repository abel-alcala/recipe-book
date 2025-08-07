export interface RecipeReference {
    name: string;
    href: string;
}

export interface ChefData {
    idName: string;
    name: string;
    bio: string;
    imageUrl: string;
    favoriteDishes: string[];
    recipes: RecipeReference[];
}

export interface Credential {
    username: string;
    hashedPassword: string;
}

export interface RecipeReference {
    name: string;
    href: string;
    imageUrl?: string;
}

export interface CuisineData {
    idName: string;
    name: string;
    region: string;
    description: string;
    popularIngredients: string[];
    typicalDishes: string[];
    recipes: RecipeReference[];
}

export interface NutritionItem {
    label: string;
    value: string;
}

export interface RecipeItem {
    name: string;
    href: string;
}

export interface IngredientData {
    idName: string;
    name: string;
    imageUrl: string;
    category: string;
    allergens: string;
    substitutes: string;
    nutrition: NutritionItem[];
    recipes: RecipeItem[];
}


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