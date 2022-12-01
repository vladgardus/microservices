import express, { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import { BadRequestError } from "../errors/bad-request-error";
import { RequestValidationError } from "../errors/request-validation-error";
import { User, UserAttrs } from "../models/user";
import AuthValidators from "../validators/AuthValidator";

const router = express.Router();

router.post("/users/signup", AuthValidators.all, async (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  const { email, password } = req.body as UserAttrs;
  if (!errors.isEmpty()) {
    next(new RequestValidationError(errors.array()));
    return;
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    next(new BadRequestError("Email in use"));
    return;
  }

  const user = User.build({ email, password });
  await user.save();

  res.status(201).send(user);
});

export { router as signupRouter };
