import {ChefData, CuisineData, IngredientData, MealPlanData, RecipeData} from "./types/models.ts";

export interface Model {
    chef?: ChefData;
    chefs?: ChefData[];
    recipe?: RecipeData;
    recipes?: RecipeData[];
    cuisine?: CuisineData;
    cuisines?: CuisineData[];
    ingredient?: IngredientData;
    ingredients?: IngredientData[];
    mealplan?: MealPlanData;
    mealplans?: MealPlanData[];
}

export const init: Model = {};