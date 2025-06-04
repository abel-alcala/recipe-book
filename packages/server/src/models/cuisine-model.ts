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