import express, { Response, NextFunction, Request } from "express";
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/unauthorized-error";

export interface UserPayload {
  id: string;
  email: string;
}
export interface JWTPayload extends UserPayload {
  iat: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      jwt?: JWTPayload;
    }
  }
}

export async function isAuthenticated(req: Request, res: Response, next: NextFunction) {
  if (!req.session?.jwt) {
    next(new UnauthorizedError());
    return;
  }
  try {
    const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY!) as JWTPayload;

    req.user = { id: payload.id, email: payload.email } as UserPayload;
    req.jwt = payload;

    return next();
  } catch (err) {
    next(new UnauthorizedError());
    return;
  }
}
