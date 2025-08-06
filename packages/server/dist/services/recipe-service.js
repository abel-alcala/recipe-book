"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var recipe_service_exports = {};
__export(recipe_service_exports, {
  default: () => recipe_service_default
});
module.exports = __toCommonJS(recipe_service_exports);
var import_mongoose = require("mongoose");
const ChefReferenceSchema = new import_mongoose.Schema({
  name: { type: String, required: true },
  href: { type: String, required: true }
});
const CuisineReferenceSchema = new import_mongoose.Schema({
  name: { type: String, required: true },
  href: { type: String, required: true }
});
const IngredientReferenceSchema = new import_mongoose.Schema({
  name: { type: String, required: true },
  href: { type: String, required: true }
});
const MealPlanReferenceSchema = new import_mongoose.Schema({
  name: { type: String, required: true },
  href: { type: String, required: true }
});
const RecipeSchema = new import_mongoose.Schema(
  {
    idName: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    cookingTime: { type: String, required: true },
    servingSize: { type: String, required: true },
    difficulty: { type: String, required: true },
    chef: { type: ChefReferenceSchema, required: true },
    cuisine: { type: CuisineReferenceSchema, required: true },
    ingredients: { type: [IngredientReferenceSchema], required: true },
    mealPlans: { type: [MealPlanReferenceSchema], required: true },
    steps: { type: [String], required: true }
  },
  { collection: "recipes" }
);
const RecipeModel = (0, import_mongoose.model)("Recipe", RecipeSchema);
function index() {
  return RecipeModel.find();
}
async function get(idName) {
  const recipe = await RecipeModel.findOne({ idName });
  if (!recipe) throw `${idName} Not Found`;
  return recipe;
}
function create(json) {
  const recipe = new RecipeModel(json);
  return recipe.save();
}
function update(idName, recipe) {
  return RecipeModel.findOneAndUpdate({ idName }, recipe, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${idName} not updated`;
    else return updated;
  });
}
function remove(idName) {
  return RecipeModel.findOneAndDelete({ idName }).then(
    (deleted) => {
      if (!deleted) throw `${idName} not deleted`;
    }
  );
}
var recipe_service_default = { index, get, create, update, remove };
