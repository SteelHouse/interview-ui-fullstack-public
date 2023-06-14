import { prisma } from "../db/prisma-client";
import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { DarkSideError } from "../utils/Errors";

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

  // check user exists
  const user = await prisma.user.findFirst({
    select: {email: true, id: true, name: true, role: true},
    where: { email: authData[0], password: authData[1] },
  });

  if (!user) {
    return res
      .status(401)
      .json({ error: "Check email and password are correct" });
  }

  // check user role - prevent role=`dark_side` from logging in
  // throw a DarkSideError
  if (user.role === `dark_side`) {
    return next(new DarkSideError());
  }

  // create and sign jwt with user
  const token = jwt.sign(user, "SECRET", {
    expiresIn: 15 * 60, // 15 min
  });

  // add token to user record in db
  await prisma.user.update({
    data: {token},
    where: {id: user.id}
  })
 
  // send user and jwt in response
  res.status(201).json({user, token});
}

export async function logout(req: Request, res: Response, next: NextFunction) {
  await prisma.user.update({data: {token: undefined}, where: {id: req.user.id}});
  res.status(200).send();
}
