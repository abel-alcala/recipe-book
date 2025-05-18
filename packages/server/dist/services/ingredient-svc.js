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
var ingredient_svc_exports = {};
__export(ingredient_svc_exports, {
  default: () => ingredient_svc_default
});
module.exports = __toCommonJS(ingredient_svc_exports);
var import_mongoose = require("mongoose");
const NutritionSchema = new import_mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
});
const RecipeSchema = new import_mongoose.Schema({
  name: { type: String, required: true },
  href: { type: String, required: true }
});
const IngredientSchema = new import_mongoose.Schema(
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
const IngredientModel = (0, import_mongoose.model)("Ingredient", IngredientSchema);
function index() {
  return IngredientModel.find();
}
async function get(idName) {
  const ingredient = await IngredientModel.findOne({ idName });
  if (!ingredient) throw `${idName} Not Found`;
  return ingredient;
}
function create(json) {
  const ingredient = new IngredientModel(json);
  return ingredient.save();
}
function update(idName, ingredient) {
  return IngredientModel.findOneAndUpdate({ idName }, ingredient, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${idName} not updated`;
    else return updated;
  });
}
function remove(idName) {
  return IngredientModel.findOneAndDelete({ idName }).then(
    (deleted) => {
      if (!deleted) throw `${idName} not deleted`;
    }
  );
}
var ingredient_svc_default = { index, get, create, update, remove };
