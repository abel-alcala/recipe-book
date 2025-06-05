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
var chef_routes_exports = {};
__export(chef_routes_exports, {
  default: () => chef_routes_default
});
module.exports = __toCommonJS(chef_routes_exports);
var import_express = __toESM(require("express"));
var import_chef_service = __toESM(require("../services/chef-service"));
var import_jsonwebtoken = __toESM(require("jsonwebtoken"));
var import_dotenv = __toESM(require("dotenv"));
import_dotenv.default.config();
const router = import_express.default.Router();
function getUsernameFromToken(req) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return null;
  try {
    const decoded = import_jsonwebtoken.default.verify(token, process.env.TOKEN_SECRET || "NOT_A_SECRET");
    return decoded.username;
  } catch {
    return null;
  }
}
router.get("/", (_, res) => {
  import_chef_service.default.index().then((list) => res.json(list)).catch((err) => res.status(500).send(err));
});
router.get("/:idName", (req, res) => {
  const { idName } = req.params;
  import_chef_service.default.get(idName).then((chef) => res.json(chef)).catch((err) => res.status(404).send(err));
});
router.post("/", (req, res) => {
  const newChef = req.body;
  const username = getUsernameFromToken(req);
  if (!username) {
    res.status(401).send("Unauthorized");
    return;
  }
  if (newChef.idName !== username) {
    res.status(403).send("You can only create a chef profile for yourself");
    return;
  }
  import_chef_service.default.create(newChef).then(
    (chef) => res.status(201).json(chef)
  ).catch((err) => res.status(500).send(err));
});
router.put("/:idName", (req, res) => {
  const { idName } = req.params;
  const updatedChef = req.body;
  const username = getUsernameFromToken(req);
  if (!username) {
    res.status(401).send("Unauthorized");
    return;
  }
  if (idName !== username) {
    res.status(403).send("You can only edit your own chef profile");
    return;
  }
  if (updatedChef.idName !== idName) {
    res.status(400).send("Cannot change chef ID");
    return;
  }
  import_chef_service.default.update(idName, updatedChef).then((chef) => res.json(chef)).catch((err) => res.status(404).send(err));
});
router.delete("/:idName", (req, res) => {
  const { idName } = req.params;
  const username = getUsernameFromToken(req);
  if (!username) {
    res.status(401).send("Unauthorized");
    return;
  }
  if (idName !== username) {
    res.status(403).send("You can only delete your own chef profile");
    return;
  }
  import_chef_service.default.remove(idName).then(() => res.status(204).end()).catch((err) => res.status(404).send(err));
});
var chef_routes_default = router;
