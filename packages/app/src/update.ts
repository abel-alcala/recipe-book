import {Auth, Update} from "@calpoly/mustang";
import {Msg} from "./messages";
import {Model} from "./model";
import {ChefData, CuisineData, IngredientData, MealPlanData, RecipeData} from "./types/models.ts";

export default function update(
    message: Msg,
    apply: Update.ApplyMap<Model>,
    user: Auth.User
) {
    switch (message[0]) {
        case "chef/load":
            loadChef(message[1], user)
                .then((chef) =>
                    apply((model) => ({...model, chef}))
                )
                .catch((error) => {
                    console.error("Failed to load chef:", error);
                });
            break;

        case "chef/save":
            saveChef(message[1], user)
                .then((chef) =>
                    apply((model) => ({...model, chef}))
                )
                .then(() => {
                    const {onSuccess} = message[1];
                    if (onSuccess) onSuccess();
                })
                .catch((error) => {
                    console.error("Failed to save chef:", error);
                    const {onFailure} = message[1];
                    if (onFailure) onFailure(error);
                });
            break;

        case "chefs/load":
            loadChefs(user)
                .then((chefs) =>
                    apply((model) => ({...model, chefs}))
                )
                .catch((error) => {
                    console.error("Failed to load chefs:", error);
                });
            break;

        case "recipe/load":
            loadRecipe(message[1], user)
                .then((recipe) =>
                    apply((model) => ({...model, recipe}))
                )
                .catch((error) => {
                    console.error("Failed to load recipe:", error);
                });
            break;

        case "recipe/create":
            createRecipe(message[1], user)
                .then((recipe) =>
                    apply((model) => ({...model, recipe}))
                )
                .then(() => {
                    const {onSuccess} = message[1];
                    if (onSuccess) onSuccess();
                })
                .catch((error) => {
                    console.error("Failed to create recipe:", error);
                    const {onFailure} = message[1];
                    if (onFailure) onFailure(error);
                });
            break;

        case "recipes/load":
            loadRecipes()
                .then((recipes) =>
                    apply((model) => ({...model, recipes}))
                )
                .catch((error) => {
                    console.error("Failed to load recipes:", error);
                });
            break;

        case "cuisine/load":
            loadCuisine(message[1], user)
                .then((cuisine) =>
                    apply((model) => ({...model, cuisine}))
                )
                .catch((error) => {
                    console.error("Failed to load cuisine:", error);
                });
            break;

        case "cuisines/load":
            loadCuisines(user)
                .then((cuisines) =>
                    apply((model) => ({...model, cuisines}))
                )
                .catch((error) => {
                    console.error("Failed to load cuisines:", error);
                });
            break;

        case "ingredient/load":
            loadIngredient(message[1], user)
                .then((ingredient) =>
                    apply((model) => ({...model, ingredient}))
                )
                .catch((error) => {
                    console.error("Failed to load ingredient:", error);
                });
            break;

        case "ingredients/load":
            loadIngredients(user)
                .then((ingredients) =>
                    apply((model) => ({...model, ingredients}))
                )
                .catch((error) => {
                    console.error("Failed to load ingredients:", error);
                });
            break;


        case "mealplan/load":
            loadMealPlan(message[1])
                .then((mealplan) => {
                    apply((model) => ({...model, mealplan}));
                    const {onSuccess} = message[1];
                    if (onSuccess) onSuccess();
                })
                .catch((error) => {
                    console.error("Failed to load meal plan:", error);
                    apply((model) => ({...model, mealplan: undefined}));
                    const {onFailure} = message[1];
                    if (onFailure) onFailure(error);
                });
            break;

        case "mealplans/load":
            loadMealPlans()
                .then((mealplans) =>
                    apply((model) => ({...model, mealplans}))
                )
                .catch((error) => {
                    console.error("Failed to load meal plans:", error);
                });
            break;

        default:
            const unhandled: never = message[0];
            throw new Error(`Unhandled message "${unhandled}"`);
    }
}

function loadChef(
    payload: { chefId: string },
    user: Auth.User
): Promise<ChefData | undefined> {
    return fetch(`/api/chefs/${payload.chefId}`, {
        headers: Auth.headers(user)
    })
        .then((response: Response) => {
            if (response.status === 200) {
                return response.json();
            }
            throw new Error(`Failed to load chef: ${response.status}`);
        })
        .then((json: unknown) => {
            console.log("Chef loaded:", json);
            return json as ChefData;
        });
}

function saveChef(
    payload: { chefId: string; chef: ChefData },
    user: Auth.User
): Promise<ChefData> {
    return fetch(`/api/chefs/${payload.chefId}`, {
        method: "PUT",
        headers: {
            ...Auth.headers(user),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload.chef)
    })
        .then((response: Response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 401) {
                throw new Error("You are not authorized to edit this chef profile");
            } else if (response.status === 403) {
                throw new Error("You can only edit your own chef profile");
            } else {
                throw new Error(`Failed to save chef: ${response.status}`);
            }
        })
        .then((json: unknown) => {
            console.log("Chef saved:", json);
            return json as ChefData;
        });
}

function loadChefs(user: Auth.User): Promise<ChefData[]> {
    return fetch("/api/chefs", {
        headers: Auth.headers(user)
    })
        .then((response: Response) => {
            if (response.status === 200) {
                return response.json();
            }
            throw new Error(`Failed to load chefs: ${response.status}`);
        })
        .then((json: unknown) => {
            console.log("Chefs loaded:", json);
            return json as ChefData[];
        });
}

function loadRecipe(
    payload: { recipeId: string },
    user: Auth.User
): Promise<RecipeData | undefined> {
    return fetch(`/api/recipes/${payload.recipeId}`, {
        headers: Auth.headers(user)
    })
        .then((response: Response) => {
            if (response.status === 200) {
                return response.json();
            }
            throw new Error(`Failed to load recipe: ${response.status}`);
        })
        .then((json: unknown) => {
            console.log("Recipe loaded:", json);
            return json as RecipeData;
        });
}

function createRecipe(
    payload: { recipe: RecipeData },
    user: Auth.User
): Promise<RecipeData> {
    return fetch("/api/recipes", {
        method: "POST",
        headers: {
            ...Auth.headers(user),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(payload.recipe)
    })
        .then((response: Response) => {
            if (response.status === 201) {
                return response.json();
            } else if (response.status === 401) {
                throw new Error("You are not authorized to create recipes");
            } else {
                throw new Error(`Failed to create recipe: ${response.status}`);
            }
        })
        .then((json: unknown) => {
            console.log("Recipe created:", json);
            return json as RecipeData;
        });
}

function loadRecipes(): Promise<RecipeData[]> {
    return fetch("/api/recipes")
        .then((response: Response) => {
            if (response.status === 200) {
                return response.json();
            }
            throw new Error(`Failed to load recipes: ${response.status}`);
        })
        .then((json: unknown) => {
            console.log("Recipes loaded:", json);
            return json as RecipeData[];
        });
}

function loadCuisine(
    payload: { cuisineId: string },
    user: Auth.User
): Promise<CuisineData | undefined> {
    return fetch(`/api/cuisines/${payload.cuisineId}`, {
        headers: Auth.headers(user)
    })
        .then((response: Response) => {
            if (response.status === 200) {
                return response.json();
            }
            throw new Error(`Failed to load cuisine: ${response.status}`);
        })
        .then((json: unknown) => {
            console.log("Cuisine loaded:", json);
            return json as CuisineData;
        });
}

function loadCuisines(user: Auth.User): Promise<CuisineData[]> {
    return fetch("/api/cuisines", {
        headers: Auth.headers(user)
    })
        .then((response: Response) => {
            if (response.status === 200) {
                return response.json();
            }
            throw new Error(`Failed to load cuisines: ${response.status}`);
        })
        .then((json: unknown) => {
            console.log("Cuisines loaded:", json);
            return json as CuisineData[];
        });
}

function loadIngredient(
    payload: { ingredientId: string },
    user: Auth.User
): Promise<IngredientData | undefined> {
    return fetch(`/api/ingredients/${payload.ingredientId}`, {
        headers: Auth.headers(user)
    })
        .then((response: Response) => {
            if (response.status === 200) {
                return response.json();
            }
            throw new Error(`Failed to load ingredient: ${response.status}`);
        })
        .then((json: unknown) => {
            console.log("Ingredient loaded:", json);
            return json as IngredientData;
        });
}

function loadIngredients(user: Auth.User): Promise<IngredientData[]> {
    return fetch("/api/ingredients", {
        headers: Auth.headers(user)
    })
        .then((response: Response) => {
            if (response.status === 200) {
                return response.json();
            }
            throw new Error(`Failed to load ingredients: ${response.status}`);
        })
        .then((json: unknown) => {
            console.log("Ingredients loaded:", json);
            return json as IngredientData[];
        });
}

function loadMealPlan(
    payload: { mealplanId: string }
): Promise<MealPlanData | undefined> {
    return fetch(`/api/mealplans/${payload.mealplanId}`)
        .then((response: Response) => {
            if (response.status === 200) {
                return response.json();
            } else if (response.status === 404) {
                throw new Error(`Meal plan "${payload.mealplanId}" not found`);
            } else if (response.status >= 500) {
                throw new Error("Server error while loading meal plan. Please try again later.");
            } else {
                throw new Error(`Failed to load meal plan: ${response.status}`);
            }
        })
        .then((json: unknown) => {
            console.log("Meal plan loaded:", json);
            const mealplan = json as MealPlanData;
            if (!mealplan.name || !mealplan.idName) {
                throw new Error("Invalid meal plan data received from server");
            }
            if (!mealplan.recipes) {
                mealplan.recipes = [];
            }
            mealplan.recipes = mealplan.recipes.map(recipe => ({
                ...recipe,
                href: recipe.href || '#',
                name: recipe.name || 'Untitled Recipe'
            }));

            return mealplan;
        })
        .catch((error) => {
            if (error instanceof TypeError && error.message.includes('fetch')) {
                throw new Error("Network error: Unable to connect to server");
            }
            throw error;
        });
}

function loadMealPlans(): Promise<MealPlanData[]> {
    return fetch("/api/mealplans")
        .then((response: Response) => {
            if (response.status === 200) {
                return response.json();
            }
            throw new Error(`Failed to load meal plans: ${response.status}`);
        })
        .then((json: unknown) => {
            console.log("Meal plans loaded:", json);
            return json as MealPlanData[];
        });
}