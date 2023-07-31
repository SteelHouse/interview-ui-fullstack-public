import { Router } from "express";
import { login, logout } from "./controller";
import { authenticationMiddleware } from "../middleware";

const authRouter = Router();

authRouter.post('/login', login);
authRouter.post('/logout', authenticationMiddleware, logout);

export { authRouter };
