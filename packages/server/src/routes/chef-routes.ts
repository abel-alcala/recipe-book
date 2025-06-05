import express, {Request, Response} from "express";
import {ChefData} from "../models/chef-model";
import Chefs from "../services/chef-service";
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
    const username = getUsernameFromToken(req);
    if (!username) {
        res.status(401).send("Unauthorized");
        return;
    }
    if (newChef.idName !== username) {
        res.status(403).send("You can only create a chef profile for yourself");
        return;
    }
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

    Chefs.update(idName, updatedChef)
        .then((chef: ChefData) => res.json(chef))
        .catch((err) => res.status(404).send(err));
});

// DELETE a chef
router.delete("/:idName", (req: Request, res: Response) => {
    const {idName} = req.params;
    const username = getUsernameFromToken(req);

    if (!username) {
        res.status(401).send("Unauthorized");
        return;
    }

    if (idName !== username) {
        res.status(403).send("You can only delete your own chef profile");
        return;
    }

    Chefs.remove(idName)
        .then(() => res.status(204).end())
        .catch((err) => res.status(404).send(err));
});

export default router;