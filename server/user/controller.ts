import type { Request, Response, NextFunction } from "express";

export function me(req: Request, res: Response, _next: NextFunction) {
  // Interviewee task - return user
  console.log('/me endpoint accessed');
  console.log('user is:');
  console.dir(req.user);

  // res.status(200).json({user: req.user});
  res.status(200).json(req.user);
}
