"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var mealplan_routes_exports = {};
__export(mealplan_routes_exports, {
  default: () => mealplan_routes_default
});
module.exports = __toCommonJS(mealplan_routes_exports);
var import_express = __toESM(require("express"));
var import_mealplan_service = __toESM(require("../services/mealplan-service"));
const router = import_express.default.Router();
router.get("/", (_, res) => {
  import_mealplan_service.default.index().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:idName", (req, res) => {
  const { idName } = req.params;
  import_mealplan_service.default.get(idName).then((mealplan) => res.json(mealplan)).catch((err) => res.status(404).send(err));
});
router.post("/", (req, res) => {
  const newMealPlan = req.body;
  import_mealplan_service.default.create(newMealPlan).then(
    (mealplan) => res.status(201).json(mealplan)
  ).catch((err) => res.status(500).send(err));
});
router.put("/:idName", (req, res) => {
  const { idName } = req.params;
  const updatedMealPlan = req.body;
  import_mealplan_service.default.update(idName, updatedMealPlan).then((mealplan) => res.json(mealplan)).catch((err) => res.status(404).send(err));
});
router.delete("/:idName", (req, res) => {
  const { idName } = req.params;
  import_mealplan_service.default.remove(idName).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var mealplan_routes_default = router;
