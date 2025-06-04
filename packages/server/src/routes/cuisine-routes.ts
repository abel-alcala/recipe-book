import express, {Request, Response} from "express";
import {CuisineData} from "../models/cuisine-model";
import Cuisines from "../services/cuisine-service";

const router = express.Router();

// GET all cuisines
router.get("/", (_: Request, res: Response) => {
    Cuisines.index()
        .then((list: CuisineData[]) => res.json(list))
        .catch((err) => res.status(500).send(err));
});

// GET cuisine by idName
router.get("/:idName", (req: Request, res: Response) => {
    const {idName} = req.params;

    Cuisines.get(idName)
        .then((cuisine: CuisineData) => res.json(cuisine))
        .catch((err) => res.status(404).send(err));
});

// POST new cuisine
router.post("/", (req: Request, res: Response) => {
    const newCuisine = req.body;

    Cuisines.create(newCuisine)
        .then((cuisine: CuisineData) =>
            res.status(201).json(cuisine)
        )
        .catch((err) => res.status(500).send(err));
});

// PUT a cuisine
router.put("/:idName", (req: Request, res: Response) => {
    const {idName} = req.params;
    const updatedCuisine = req.body;

    Cuisines.update(idName, updatedCuisine)
        .then((cuisine: CuisineData) => res.json(cuisine))
        .catch((err) => res.status(404).send(err));
});

// DELETE a cuisine
router.delete("/:idName", (req: Request, res: Response) => {
    const {idName} = req.params;

    Cuisines.remove(idName)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default router;