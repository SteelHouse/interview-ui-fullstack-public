import { User } from "@prisma/client";
import { prisma } from "../db/prisma-client";
import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { DarkSideError } from "../utils/Errors";
import { JWT_SECRET, ROLE_DARKSIDE } from "../auth/controller" // NOTE: the secret should come from a .env or secrets manager or something

export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Interviewee Task - implement middleware

  // authorization is in the form of a bearer token
  // get the authorization and bearer token
  const auth = req.headers['authorization'];

  // validate the auth header has correct format (bearer and token present)
  const hasBearer = auth && auth.split(' ')[0] == 'Bearer';
  if (!hasBearer) throw Error('No authorization bearer present');

  const token = auth.split(' ')[1];
  if (!token) throw Error('No jwt token present');

  try {
    const user = jwt.verify(token, JWT_SECRET) as User;

    // prevent dark side from accessing role=`dark_side` throw DarkSideError
    if (user.role == ROLE_DARKSIDE) {
      console.log("darkside user");
      throw new DarkSideError("No sith allowed! Off to the Sarlacc with you!");
    }

    // add user to the request
    req.user = user;

    // check user exists in db with token
    await prisma.user.findFirstOrThrow({
      where: {id: req.user.id },
    });
    next();
  } catch (error) {
    console.log('error', error);
    if (error instanceof DarkSideError) {
      return res.status(401).json({error: `The Dark Side will be vanquished`});
    }
    return res.status(401).json({error: `Unauthenticated`});
  }
};
