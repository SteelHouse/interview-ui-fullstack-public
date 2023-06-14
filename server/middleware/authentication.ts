import { User } from "@prisma/client";
import { prisma } from "../db/prisma-client";
import type { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken';
import { DarkSideError } from "../utils/Errors";

export const authenticationMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Interviewee Task - implement middleware

  // authorization is in the form of a bearer token
  // get the authorization and bearer token
  const auth = req.headers['authorization'] as string;

  // validate the auth header has correct format (bearer and token present)
  const hasBearer = /^bearer\b/i.test(auth);
  if (!hasBearer) throw Error('No authorization bearer present');

  const [_, token] = auth.split(/^bearer\b\s*/i);
  if (!token) throw Error('No jwt token present');

  try {
    const user = jwt.verify(token, 'SECRET') as User;

    // prevent dark side from accessing role=`dark_side` throw DarkSideError
    if (user.role === 'dark_side') throw new DarkSideError(`You should not be here.`);

    // add user to the request
    req.user = user;

    // check user exists in db with token
    await prisma.user.findFirstOrThrow({
      where: {id: req.user.id, token },
    });
    next();
  } catch (error) {
    if (error instanceof DarkSideError) {
      return res.status(401).json({error: `The Dark Side will be vanquished`});
    }
    return res.status(401).json({error: `Unauthenticated`});
  }
};
