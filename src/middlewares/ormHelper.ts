import { RequestContext } from "@mikro-orm/core";
import { NextFunction, Request, Response } from "express";
import orm from "../config/db";


export const requestContextHelper = (req: Request, res: Response, next: NextFunction) => {
  RequestContext.create(orm.em, next);
}