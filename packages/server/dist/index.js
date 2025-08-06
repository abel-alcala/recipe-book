"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var index_exports = {};
module.exports = __toCommonJS(index_exports);
var import_express = __toESM(require("express"));
var import_mongo = require("./services/mongo");
var import_auth = __toESM(require("./routes/auth"));
var import_cors = __toESM(require("cors"));
var import_promises = __toESM(require("node:fs/promises"));
var import_path = __toESM(require("path"));
var import_ingredients = __toESM(require("./routes/ingredients"));
var import_chef_routes = __toESM(require("./routes/chef-routes"));
var import_cuisine_routes = __toESM(require("./routes/cuisine-routes"));
var import_mealplan_routes = __toESM(require("./routes/mealplan-routes"));
var import_recipe_routes = __toESM(require("./routes/recipe-routes"));
(0, import_mongo.connect)("recipes");
const app = (0, import_express.default)();
const port = process.env.PORT || 3e3;
const staticDir = process.env.STATIC || "public";
app.use(import_express.default.static(staticDir));
app.use(import_express.default.json());
app.use((0, import_cors.default)());
app.get("/hello", (_, res) => {
  res.send("Hello, World");
});
app.use("/auth", import_auth.default);
app.use("/app", (_, res) => {
  const indexHtml = import_path.default.resolve(staticDir, "index.html");
  import_promises.default.readFile(indexHtml, { encoding: "utf8" }).then(
    (html) => res.send(html)
  );
});
app.use("/api/ingredients", import_auth.authenticateUser, import_ingredients.default);
app.use("/api/chefs", import_auth.authenticateUser, import_chef_routes.default);
app.use("/api/cuisines", import_auth.authenticateUser, import_cuisine_routes.default);
app.use("/api/mealplans", import_mealplan_routes.default);
app.use("/api/recipes/create", import_auth.authenticateUser, import_recipe_routes.default);
app.use("/api/recipes", import_recipe_routes.default);
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
