import {ChefData, RecipeData} from "./types/models.ts";

export type Msg =
    | ["chef/load", { chefId: string }]
    | ["chef/save", {
        chefId: string;
        chef: ChefData;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void; }]
    | ["chefs/load", {}]
    | ["recipe/load", { recipeId: string }]
    | ["recipe/create", {
        recipe: RecipeData;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void; }]
    | ["recipes/load", {}]
    | ["cuisine/load", { cuisineId: string }]
    | ["cuisines/load", {}]
    | ["ingredient/load", { ingredientId: string }]
    | ["ingredients/load", {}]
    | ["mealplan/load", {
        mealplanId: string;
        onSuccess?: () => void;
        onFailure?: (err: Error) => void;
}]
    | ["mealplans/load", {}];