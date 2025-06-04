import express, {Request, Response} from "express";
import {RecipeData} from "../models/recipe-model";
import Recipes from "../services/recipe-service";

const router = express.Router();

// GET all recipes
router.get("/", (_: Request, res: Response) => {
    Recipes.index()
        .then((list: RecipeData[]) => res.json(list))
        .catch((err) => res.status(500).send(err));
});

// GET recipe by idName
router.get("/:idName", (req: Request, res: Response) => {
    const {idName} = req.params;

    Recipes.get(idName)
        .then((recipe: RecipeData) => res.json(recipe))
        .catch((err) => res.status(404).send(err));
});

// POST new recipe
router.post("/", (req: Request, res: Response) => {
    const newRecipe = req.body;

    Recipes.create(newRecipe)
        .then((recipe: RecipeData) =>
            res.status(201).json(recipe)
        )
        .catch((err) => res.status(500).send(err));
});

// PUT a recipe
router.put("/:idName", (req: Request, res: Response) => {
    const {idName} = req.params;
    const updatedRecipe = req.body;

    Recipes.update(idName, updatedRecipe)
        .then((recipe: RecipeData) => res.json(recipe))
        .catch((err) => res.status(404).send(err));
});

// DELETE a recipe
router.delete("/:idName", (req: Request, res: Response) => {
    const {idName} = req.params;

    Recipes.remove(idName)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default router;