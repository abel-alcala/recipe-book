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