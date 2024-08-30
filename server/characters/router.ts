import { Router } from "express";
import { getCharacters } from "./controller";

const charactersRouter = Router();

charactersRouter.get('/', getCharacters);

export { charactersRouter };
