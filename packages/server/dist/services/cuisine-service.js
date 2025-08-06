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
var cuisine_service_exports = {};
__export(cuisine_service_exports, {
  default: () => cuisine_service_default
});
module.exports = __toCommonJS(cuisine_service_exports);
var import_mongoose = require("mongoose");
const RecipeReferenceSchema = new import_mongoose.Schema({
  name: { type: String, required: true },
  href: { type: String, required: true },
  imageUrl: { type: String, required: false }
});
const CuisineSchema = new import_mongoose.Schema(
  {
    idName: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    region: { type: String, required: true },
    description: { type: String, required: true },
    popularIngredients: { type: [String], required: true },
    typicalDishes: { type: [String], required: true },
    recipes: { type: [RecipeReferenceSchema], required: true }
  },
  { collection: "cuisines" }
);
const CuisineModel = (0, import_mongoose.model)("Cuisine", CuisineSchema);
function index() {
  return CuisineModel.find();
}
async function get(idName) {
  const cuisine = await CuisineModel.findOne({ idName });
  if (!cuisine) throw `${idName} Not Found`;
  return cuisine;
}
function create(json) {
  const cuisine = new CuisineModel(json);
  return cuisine.save();
}
function update(idName, cuisine) {
  return CuisineModel.findOneAndUpdate({ idName }, cuisine, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${idName} not updated`;
    else return updated;
  });
}
function remove(idName) {
  return CuisineModel.findOneAndDelete({ idName }).then(
    (deleted) => {
      if (!deleted) throw `${idName} not deleted`;
    }
  );
}
var cuisine_service_default = { index, get, create, update, remove };
