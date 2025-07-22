import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";


export default function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (res.headersSent) {
    return next(err);
  }
  logger.error(err);
  res.sendStatus(500)
}