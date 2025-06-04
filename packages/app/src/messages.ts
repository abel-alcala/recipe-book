import {ChefData} from "server/models";

export type Msg =
    | ["chef/load", { chefId: string }]
    | ["chef/save", { chefId: string; chef: ChefData }]
    | ["chefs/load", {}]
    | ["recipe/load", { recipeId: string }]
    | ["recipes/load", {}]
    | ["cuisine/load", { cuisineId: string }]
    | ["cuisines/load", {}]
    | ["ingredient/load", { ingredientId: string }]
    | ["ingredients/load", {}]
    | ["mealplan/load", { mealplanId: string }]
    | ["mealplans/load", {}];