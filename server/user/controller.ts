import type { Request, Response, NextFunction } from "express";

export function me(req: Request, res: Response, _next: NextFunction) {
  // Interviewee task - return user
  res.status(200).json({});
}
