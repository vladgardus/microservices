import express, { NextFunction, Request, Response } from "express";
import { BadRequestError, validateRequest } from "@vgticketingapp/common";
import { User, UserAttrs, UserMapper } from "../models/user";
import AuthValidators from "../validators/AuthValidator";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/users/signup", AuthValidators.signup, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as UserAttrs;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    next(new BadRequestError("Email in use"));
    return;
  }

  const user = User.build({ email, password });
  await user.save();

  const userJwt = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_KEY!);
  req.session = { jwt: userJwt };

  res.status(201).send(UserMapper.toDTO(user));
});

export { router as signupRouter };
