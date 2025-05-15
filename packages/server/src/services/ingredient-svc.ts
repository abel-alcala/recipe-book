import { Schema, model } from "mongoose";
import { IngredientData, NutritionItem, RecipeItem } from "../models/ingredient";

const NutritionSchema = new Schema<NutritionItem>({
    label: { type: String, required: true },
    value: { type: String, required: true }
});

const RecipeSchema = new Schema<RecipeItem>({
    name: { type: String, required: true },
    href: { type: String, required: true }
});

const IngredientSchema = new Schema<IngredientData>(
    {
        idName: { type: String, required: true },
        name: { type: String, required: true, unique: true },
        imageUrl: { type: String, required: true },
        category: { type: String, required: true },
        allergens: { type: String, required: true },
        substitutes: { type: String, required: true },
        nutrition: { type: [NutritionSchema], required: true },
        recipes: { type: [RecipeSchema], required: true }
    },
    { collection: "ingredients" }
);

const IngredientModel = model<IngredientData>("Ingredient", IngredientSchema);

function index(): Promise<IngredientData[]> {
    return IngredientModel.find();
}

async function get(idName: string): Promise<IngredientData> {
    const ingredient = await IngredientModel.findOne({ idName: idName });
    if (!ingredient) throw `${idName} Not Found`;
    return ingredient;
}

export default { index, get };