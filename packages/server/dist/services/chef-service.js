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
var chef_service_exports = {};
__export(chef_service_exports, {
  default: () => chef_service_default
});
module.exports = __toCommonJS(chef_service_exports);
var import_mongoose = require("mongoose");
const RecipeReferenceSchema = new import_mongoose.Schema({
  name: { type: String, required: true },
  href: { type: String, required: true }
});
const ChefSchema = new import_mongoose.Schema(
  {
    idName: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    bio: { type: String, required: true },
    imageUrl: { type: String, required: true },
    favoriteDishes: { type: [String], required: true },
    recipes: { type: [RecipeReferenceSchema], required: true }
  },
  { collection: "chefs" }
);
const ChefModel = (0, import_mongoose.model)("Chef", ChefSchema);
function index() {
  return ChefModel.find();
}
async function get(idName) {
  const chef = await ChefModel.findOne({ idName });
  if (!chef) throw `${idName} Not Found`;
  return chef;
}
function create(json) {
  const chef = new ChefModel(json);
  return chef.save();
}
function update(idName, chef) {
  return ChefModel.findOneAndUpdate({ idName }, chef, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${idName} not updated`;
    else return updated;
  });
}
function remove(idName) {
  return ChefModel.findOneAndDelete({ idName }).then(
    (deleted) => {
      if (!deleted) throw `${idName} not deleted`;
    }
  );
}
var chef_service_default = { index, get, create, update, remove };
