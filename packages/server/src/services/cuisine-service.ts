import {model, Schema} from "mongoose";
import {CuisineData, RecipeReference} from "../models/cuisine-model";

const RecipeReferenceSchema = new Schema<RecipeReference>({
    name: {type: String, required: true},
    href: {type: String, required: true},
    imageUrl: {type: String, required: false}
});

const CuisineSchema = new Schema<CuisineData>(
    {
        idName: {type: String, required: true, unique: true},
        name: {type: String, required: true},
        region: {type: String, required: true},
        description: {type: String, required: true},
        popularIngredients: {type: [String], required: true},
        typicalDishes: {type: [String], required: true},
        recipes: {type: [RecipeReferenceSchema], required: true}
    },
    {collection: "cuisines"}
);

const CuisineModel = model<CuisineData>("Cuisine", CuisineSchema);

function index(): Promise<CuisineData[]> {
    return CuisineModel.find();
}

async function get(idName: string): Promise<CuisineData> {
    const cuisine = await CuisineModel.findOne({idName: idName});
    if (!cuisine) throw `${idName} Not Found`;
    return cuisine;
}

function create(json: CuisineData): Promise<CuisineData> {
    const cuisine = new CuisineModel(json);
    return cuisine.save();
}

function update(
    idName: string,
    cuisine: CuisineData
): Promise<CuisineData> {
    return CuisineModel.findOneAndUpdate({idName}, cuisine, {
        new: true
    }).then((updated) => {
        if (!updated) throw `${idName} not updated`;
        else return updated as CuisineData;
    });
}

function remove(idName: string): Promise<void> {
    return CuisineModel.findOneAndDelete({idName}).then(
        (deleted) => {
            if (!deleted) throw `${idName} not deleted`;
        }
    );
}

export default {index, get, create, update, remove};