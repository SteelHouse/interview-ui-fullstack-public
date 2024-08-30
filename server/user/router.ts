import { Router } from "express";
import { me } from "./controller";

const userRouter = Router();

userRouter.get('/', me);

export { userRouter };
