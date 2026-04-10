import {model, Schema} from "mongoose";
import {MealPlanData, RecipeReference} from "../models/mealplan-model";
import Recipes from "./recipe-service";

const RecipeReferenceSchema = new Schema<RecipeReference>({
    name: {type: String, required: true},
    href: {type: String, required: true},
    day: {type: String, required: false},
    mealType: {type: String, required: false}
});

const MealPlanSchema = new Schema<MealPlanData>(
    {
        idName: {type: String, required: true, unique: true},
        name: {type: String, required: true},
        duration: {type: String, required: true},
        purpose: {type: String, required: true},
        mealTypes: {type: [String], required: true},
        recipes: {type: [RecipeReferenceSchema], required: true}
    },
    {collection: "mealplans"}
);

const MealPlanModel = model<MealPlanData>("MealPlan", MealPlanSchema);

function index(): Promise<MealPlanData[]> {
    return MealPlanModel.find();
}

function extractIdName(href: string): string {
    if (href.startsWith('/app/recipe/')) return href.slice('/app/recipe/'.length);
    if (href.startsWith('http')) return href.split('/').pop() || '';
    return href;
}

async function get(idName: string): Promise<MealPlanData> {
    const mealplan = await MealPlanModel.findOne({idName});
    if (!mealplan) throw `${idName} Not Found`;

    const idNames = mealplan.recipes.map(r => extractIdName(r.href)).filter(Boolean);
    const imageMap = await Recipes.getImageMap(idNames);

    return {
        ...mealplan.toObject(),
        recipes: mealplan.recipes.map(r => ({
            name: r.name,
            href: r.href,
            day: r.day,
            mealType: r.mealType,
            imageUrl: imageMap.get(extractIdName(r.href))
        }))
    } as MealPlanData;
}

function create(json: MealPlanData): Promise<MealPlanData> {
    const mealplan = new MealPlanModel(json);
    return mealplan.save();
}

function update(
    idName: string,
    mealplan: MealPlanData
): Promise<MealPlanData> {
    return MealPlanModel.findOneAndUpdate({idName}, mealplan, {
        new: true
    }).then((updated) => {
        if (!updated) throw `${idName} not updated`;
        else return updated as MealPlanData;
    });
}

function remove(idName: string): Promise<void> {
    return MealPlanModel.findOneAndDelete({idName}).then(
        (deleted) => {
            if (!deleted) throw `${idName} not deleted`;
        }
    );
}

export default {index, get, create, update, remove};