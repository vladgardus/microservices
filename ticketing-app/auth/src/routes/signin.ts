import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import { UserAttrs } from "../models/user";
import AuthValidators from "../validators/AuthValidator";

const router = express.Router();

router.post("/users/signin", AuthValidators.all, (req: Request, res: Response) => {
  const errors = validationResult(req);
  const { email, password } = req.body as UserAttrs;
  if (!errors.isEmpty()) {
    return;
  }
});

export { router as signinRouter };
