import { NextFunction, Request, RequestHandler, Response } from "express";
import { validationResult } from "express-validator";


export const validator: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  console.log(errors)
  if (!errors.isEmpty()) {
    res.sendStatus(422);
    return;
  }

  return next();
}