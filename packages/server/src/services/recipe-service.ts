import {model, Schema} from "mongoose";
import {
    RecipeData,
    ChefReference,
    CuisineReference,
    IngredientReference,
    MealPlanReference
} from "../models/recipe-model";

const ChefReferenceSchema = new Schema<ChefReference>({
    name: {type: String, required: true},
    href: {type: String, required: true}
});

const CuisineReferenceSchema = new Schema<CuisineReference>({
    name: {type: String, required: true},
    href: {type: String, required: true}
});

const IngredientReferenceSchema = new Schema<IngredientReference>({
    name: {type: String, required: true},
    href: {type: String, required: true}
});

const MealPlanReferenceSchema = new Schema<MealPlanReference>({
    name: {type: String, required: true},
    href: {type: String, required: true}
});

const RecipeSchema = new Schema<RecipeData>(
    {
        idName: {type: String, required: true, unique: true},
        name: {type: String, required: true},
        description: {type: String, required: true},
        imageUrl: {type: String, required: true},
        cookingTime: {type: String, required: true},
        servingSize: {type: String, required: true},
        difficulty: {type: String, required: true},
        chef: {type: ChefReferenceSchema, required: true},
        cuisine: {type: CuisineReferenceSchema, required: true},
        ingredients: {type: [IngredientReferenceSchema], required: true},
        mealPlans: {type: [MealPlanReferenceSchema], required: true},
        steps: {type: [String], required: true}
    },
    {collection: "recipes"}
);

const RecipeModel = model<RecipeData>("Recipe", RecipeSchema);

function index(): Promise<RecipeData[]> {
    return RecipeModel.find();
}

async function get(idName: string): Promise<RecipeData> {
    const recipe = await RecipeModel.findOne({idName: idName});
    if (!recipe) throw `${idName} Not Found`;
    return recipe;
}

function create(json: RecipeData): Promise<RecipeData> {
    const recipe = new RecipeModel(json);
    return recipe.save();
}

function update(
    idName: string,
    recipe: RecipeData
): Promise<RecipeData> {
    return RecipeModel.findOneAndUpdate({idName}, recipe, {
        new: true
    }).then((updated) => {
        if (!updated) throw `${idName} not updated`;
        else return updated as RecipeData;
    });
}

function remove(idName: string): Promise<void> {
    return RecipeModel.findOneAndDelete({idName}).then(
        (deleted) => {
            if (!deleted) throw `${idName} not deleted`;
        }
    );
}

export default {index, get, create, update, remove};