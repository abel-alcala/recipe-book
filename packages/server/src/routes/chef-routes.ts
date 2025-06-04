import express, {Request, Response} from "express";
import {ChefData} from "../models/chef-model";
import Chefs from "../services/chef-service";

const router = express.Router();

// GET all chefs
router.get("/", (_: Request, res: Response) => {
    Chefs.index()
        .then((list: ChefData[]) => res.json(list))
        .catch((err) => res.status(500).send(err));
});

// GET chef by idName
router.get("/:idName", (req: Request, res: Response) => {
    const {idName} = req.params;

    Chefs.get(idName)
        .then((chef: ChefData) => res.json(chef))
        .catch((err) => res.status(404).send(err));
});

// POST new chef
router.post("/", (req: Request, res: Response) => {
    const newChef = req.body;

    Chefs.create(newChef)
        .then((chef: ChefData) =>
            res.status(201).json(chef)
        )
        .catch((err) => res.status(500).send(err));
});

// PUT a chef
router.put("/:idName", (req: Request, res: Response) => {
    const {idName} = req.params;
    const updatedChef = req.body;

    Chefs.update(idName, updatedChef)
        .then((chef: ChefData) => res.json(chef))
        .catch((err) => res.status(404).send(err));
});

// DELETE a chef
router.delete("/:idName", (req: Request, res: Response) => {
    const {idName} = req.params;

    Chefs.remove(idName)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default router;