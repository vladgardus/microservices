import express, { NextFunction, Request, Response } from "express";
import { isAuthenticated } from "@vgticketingapp/common";

const router = express.Router();

router.get("/users/currentuser", isAuthenticated, (req: Request, res: Response, next: NextFunction) => {
  const { user, jwt } = req;
  res.send(user);
});

export { router as currentUserRouter };
