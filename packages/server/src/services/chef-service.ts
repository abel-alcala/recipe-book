import {model, Schema} from "mongoose";
import {ChefData, RecipeReference} from "../models/chef-model";

const RecipeReferenceSchema = new Schema<RecipeReference>({
    name: {type: String, required: true},
    href: {type: String, required: true}
});

const ChefSchema = new Schema<ChefData>(
    {
        idName: {type: String, required: true, unique: true},
        name: {type: String, required: true},
        bio: {type: String, required: true},
        imageUrl: {type: String, required: true},
        favoriteDishes: {type: [String], required: true},
        recipes: {type: [RecipeReferenceSchema], required: true}
    },
    {collection: "chefs"}
);

const ChefModel = model<ChefData>("Chef", ChefSchema);

function index(): Promise<ChefData[]> {
    return ChefModel.find();
}

async function get(idName: string): Promise<ChefData> {
    const chef = await ChefModel.findOne({idName: idName});
    if (!chef) throw `${idName} Not Found`;
    return chef;
}

function create(json: ChefData): Promise<ChefData> {
    const chef = new ChefModel(json);
    return chef.save();
}

function update(
    idName: string,
    chef: ChefData
): Promise<ChefData> {
    return ChefModel.findOneAndUpdate({idName}, chef, {
        new: true
    }).then((updated) => {
        if (!updated) throw `${idName} not updated`;
        else return updated as ChefData;
    });
}

function remove(idName: string): Promise<void> {
    return ChefModel.findOneAndDelete({idName}).then(
        (deleted) => {
            if (!deleted) throw `${idName} not deleted`;
        }
    );
}

export default {index, get, create, update, remove};