import express, {Request, Response} from "express";
import {IngredientData} from "../models/ingredient";
import Ingredients from "../services/ingredient-svc";

const router = express.Router();

// GET all ingredients
router.get("/", (_: Request, res: Response) => {
    Ingredients.index()
        .then((list: IngredientData[]) => res.json(list))
        .catch((err) => res.status(500).send(err));
});

// GET ingredient by idName
router.get("/:idName", (req: Request, res: Response) => {
    const {idName} = req.params;

    Ingredients.get(idName)
        .then((ingredient: IngredientData) => res.json(ingredient))
        .catch((err) => res.status(404).send(err));
});

// POST new ingredient
router.post("/", (req: Request, res: Response) => {
    const newIngredient = req.body;

    Ingredients.create(newIngredient)
        .then((ingredient: IngredientData) =>
            res.status(201).json(ingredient)
        )
        .catch((err) => res.status(500).send(err));
});

// PUT an ingredient
router.put("/:idName", (req: Request, res: Response) => {
    const {idName} = req.params;
    const updatedIngredient = req.body;

    Ingredients.update(idName, updatedIngredient)
        .then((ingredient: IngredientData) => res.json(ingredient))
        .catch((err) => res.status(404).send(err));
});

// DELETE an ingredient
router.delete("/:idName", (req: Request, res: Response) => {
    const {idName} = req.params;

    Ingredients.remove(idName)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default router;