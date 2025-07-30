import { NextFunction, Request, RequestHandler, Response } from "express";
import { validationResult } from "express-validator";
import logger from "../config/logger";


export const validator: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  logger.error('Request errors', errors)
  if (!errors.isEmpty()) {
    res.sendStatus(422);
    return;
  }

  return next();
}