import express, { NextFunction } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from 'cookie-parser';
import { authenticationMiddleware } from "./middleware";
import { authRouter } from "./auth/router";
import { charactersRouter } from "./characters/router";
import { userRouter } from "./user/router";
import { downloadCharacters } from "./characters/controller";

const app = express();

// configure cors to allow UI to communicate with apis
app.use(
  cors({
    origin: "http://localhost:5002",
  })
);

app.use(cookieParser());
app.use(bodyParser.json());

app.use(`/auth`, authRouter);

// Interviewee Question/talking points
//  - is this secure to have here?
//  - how could this be improved?
app.get(`/characters/csv`, downloadCharacters);

app.use(authenticationMiddleware);

app.use("/me", userRouter);
app.use(`/characters`, charactersRouter);

app.use(
  (
    error: Error | string,
    req: express.Request,
    res: express.Response,
    next: NextFunction
  ) => {
    if (typeof error === "string") {
      return res.status(500).json({ error });
    }
    if (error instanceof Error) {
      return res.status(500).json({ error: error.message, cause: error.cause });
    }
    return res.status(500).json({ error: "Unknown error" });
  }
);

export { app };
