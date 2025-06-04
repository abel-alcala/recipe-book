import express, {Request, Response} from "express";
import {MealPlanData} from "../models/mealplan-model";
import MealPlans from "../services/mealplan-service";

const router = express.Router();

// GET all meal plans
router.get("/", (_: Request, res: Response) => {
    MealPlans.index()
        .then((list: MealPlanData[]) => res.json(list))
        .catch((err) => res.status(500).send(err));
});

// GET meal plan by idName
router.get("/:idName", (req: Request, res: Response) => {
    const {idName} = req.params;

    MealPlans.get(idName)
        .then((mealplan: MealPlanData) => res.json(mealplan))
        .catch((err) => res.status(404).send(err));
});

// POST new meal plan
router.post("/", (req: Request, res: Response) => {
    const newMealPlan = req.body;

    MealPlans.create(newMealPlan)
        .then((mealplan: MealPlanData) =>
            res.status(201).json(mealplan)
        )
        .catch((err) => res.status(500).send(err));
});

// PUT a meal plan
router.put("/:idName", (req: Request, res: Response) => {
    const {idName} = req.params;
    const updatedMealPlan = req.body;

    MealPlans.update(idName, updatedMealPlan)
        .then((mealplan: MealPlanData) => res.json(mealplan))
        .catch((err) => res.status(404).send(err));
});

// DELETE a meal plan
router.delete("/:idName", (req: Request, res: Response) => {
    const {idName} = req.params;

    MealPlans.remove(idName)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default router;