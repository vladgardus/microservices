import { NextFunction, Request, Response } from "express";
import { MiddlewareError } from "../errors/middleware-error";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof MiddlewareError) {
    return res.status(err.statusCode).send(err.serializeError());
  }
  res.status(400).send({ errors: [{ message: err.message ?? "Something went wrong" }] });
};
