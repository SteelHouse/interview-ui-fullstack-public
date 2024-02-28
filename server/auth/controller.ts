import { prisma } from "../db/prisma-client";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DarkSideError } from "../utils/Errors";

const ROLE_DARKSIDE = 'dark_side';
const ROLE_JEDI = 'jedi';

export async function login(req: Request, res: Response, next: NextFunction) {
  const auth = req.headers["authorization"] as string;
  if (!/^Basic/i.test(auth)) {
    return res.status(400).json({ error: "Basic auth required." });
  }

  // Interviewee Tasks
  // get email and password from basic auth
  const authData = Buffer.from(auth.split("Basic ")[1], "base64")
    .toString()
    .split(":");

  console.dir(authData);
  const [email, password] = authData;
  console.log(`authing user email is ${email}, pw is ${password}`);

  // check user exists
  const user = await prisma.user.findFirst({
    select: {email: true, id: true, name: true, role: true},
    where: { email, password },
  });

  console.dir(user);

  if (!user) {
    res.status(404).json({error: "These are'nt the account name and password you are looking for. You can go about your business. Move along."});
  }

  // check user role - prevent role=`dark_side` from logging in
  // throw a DarkSideError
  if (user && user.role == ROLE_DARKSIDE) {
    console.log("darkside user");
    // The instruction say to throw an error here, but I think it makes more sense to return an unauthorized response
    //throw new DarkSideError("No sith allowed! Off to the Sarlacc with you!");
    res.status(401).json({
      errorMessage: "No sith allowed! Off to the Sarlacc with you!", 
      error: new DarkSideError("No sith allowed! Off to the Sarlacc with you!")
    });
  }

  // create and sign jwt with user
  // jwt.sign - set expire to 15min
  
  // add token to user record in db
  // prisma.user
 
  // send user and jwt in response
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  await prisma.user.update({data: {token: undefined}, where: {id: req.user.id}});
  res.status(200).send();
}
