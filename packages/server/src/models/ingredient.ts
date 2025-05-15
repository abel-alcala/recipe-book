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
