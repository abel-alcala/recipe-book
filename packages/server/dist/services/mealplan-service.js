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
var mealplan_service_exports = {};
__export(mealplan_service_exports, {
  default: () => mealplan_service_default
});
module.exports = __toCommonJS(mealplan_service_exports);
var import_mongoose = require("mongoose");
const RecipeReferenceSchema = new import_mongoose.Schema({
  name: { type: String, required: true },
  href: { type: String, required: true },
  day: { type: String, required: false },
  mealType: { type: String, required: false }
});
const MealPlanSchema = new import_mongoose.Schema(
  {
    idName: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    duration: { type: String, required: true },
    purpose: { type: String, required: true },
    mealTypes: { type: [String], required: true },
    recipes: { type: [RecipeReferenceSchema], required: true }
  },
  { collection: "mealplans" }
);
const MealPlanModel = (0, import_mongoose.model)("MealPlan", MealPlanSchema);
function index() {
  return MealPlanModel.find();
}
async function get(idName) {
  const mealplan = await MealPlanModel.findOne({ idName });
  if (!mealplan) throw `${idName} Not Found`;
  return mealplan;
}
function create(json) {
  const mealplan = new MealPlanModel(json);
  return mealplan.save();
}
function update(idName, mealplan) {
  return MealPlanModel.findOneAndUpdate({ idName }, mealplan, {
    new: true
  }).then((updated) => {
    if (!updated) throw `${idName} not updated`;
    else return updated;
  });
}
function remove(idName) {
  return MealPlanModel.findOneAndDelete({ idName }).then(
    (deleted) => {
      if (!deleted) throw `${idName} not deleted`;
    }
  );
}
var mealplan_service_default = { index, get, create, update, remove };
