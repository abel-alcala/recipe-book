import express, {Request, Response} from "express";
import {connect} from "./services/mongo";
import auth, {authenticateUser} from "./routes/auth";
import cors from "cors";
import fs from "node:fs/promises";
import path from "path";
import ingredients from "./routes/ingredients";
import chefs from "./routes/chef-routes";
import cuisines from "./routes/cuisine-routes";
import mealplans from "./routes/mealplan-routes";
import recipes from "./routes/recipe-routes";
export type { ChefData, RecipeReference } from "./models/chef-model";
export type { RecipeData, ChefReference, CuisineReference, IngredientReference, MealPlanReference } from "./models/recipe-model";
export type { CuisineData } from "./models/cuisine-model";
export type { IngredientData, NutritionItem, RecipeItem } from "./models/ingredient";
export type { MealPlanData } from "./models/mealplan-model";

connect("recipes");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";

app.use(express.static(staticDir));
app.use(express.json());
app.use(cors());

app.get("/hello", (_: Request, res: Response) => {
    res.send("Hello, World");
});

app.use("/auth", auth);

app.use("/app", (_: Request, res: Response) => {
    const indexHtml = path.resolve(staticDir, "index.html");
    fs.readFile(indexHtml, { encoding: "utf8" }).then((html) =>
        res.send(html)
    );
});

app.use("/api/ingredients", authenticateUser, ingredients);
app.use("/api/chefs", authenticateUser, chefs);
app.use("/api/cuisines", authenticateUser, cuisines);
app.use("/api/mealplans", mealplans);
app.use("/api/recipes/create", authenticateUser, recipes);
app.use("/api/recipes", recipes);
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});