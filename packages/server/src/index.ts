import express, { Request, Response } from "express";
import { connect } from "./services/mongo";
import ingredientService from './services/ingredient-svc';

connect("recipes");

const app = express();
const port = process.env.PORT || 3000;
const staticDir = process.env.STATIC || "public";


app.use(express.static(staticDir));

app.get("/hello", (req: Request, res: Response) => {
    res.send("Hello, World");
});

app.get("/ingredients/:idName", async (req: Request, res: Response) => {
    try {
        const ingredient = await ingredientService.get(req.params.idName);
        res.json(ingredient);
    } catch (err) {
        if (typeof err === 'string' && err.includes('Not Found')) {
            res.status(404).json({ error: err });
        }
        else if (err instanceof Error && err.message.includes('Not Found')) {
            res.status(404).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'Server error' });
        }
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});