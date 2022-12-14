import express, { NextFunction, Request, Response } from "express";

const router = express.Router();

router.post("/users/signout", (req: Request, res: Response, next: NextFunction) => {
  req.session = null;
  res.clearCookie("session", { path: "/" });
  res.send({});
});

export { router as signoutRouter };
