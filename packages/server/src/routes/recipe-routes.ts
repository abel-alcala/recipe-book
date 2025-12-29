import express, {Request, Response} from "express";
import {RecipeData} from "../models/recipe-model";
import Recipes from "../services/recipe-service";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

// Helper function to extract username from JWT token
function getUsernameFromToken(req: Request): string | null {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return null;

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET || "NOT_A_SECRET") as any;
        return decoded.username;
    } catch {
        return null;
    }
}

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
    const username = getUsernameFromToken(req);

    if (!username) {
        res.status(401).send("You must be logged in to edit recipes");
        return;
    }

    // First, fetch the existing recipe to check ownership
    Recipes.get(idName)
        .then((existingRecipe: RecipeData) => {
            // Check if the user owns this recipe
            if (existingRecipe.chef.name !== username) {
                res.status(403).send("You can only edit your own recipes");
                return;
            }

            // User owns the recipe, proceed with update
            return Recipes.update(idName, updatedRecipe)
                .then((recipe: RecipeData) => res.json(recipe));
        })
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