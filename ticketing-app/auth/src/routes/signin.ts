import express, { NextFunction, Request, Response } from "express";
import { BadRequestError, validateRequest } from "@vgticketingapp/common";
import { User, UserAttrs, UserMapper } from "../models/user";
import { Password } from "../services/password";
import AuthValidators from "../validators/AuthValidator";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/users/signin", AuthValidators.signin, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body as UserAttrs;
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    next(new BadRequestError("Invalid credentials"));
    return;
  }
  const passwordsMatch = await Password.compare(existingUser.password, password);
  if (!passwordsMatch) {
    next(new BadRequestError("Invalid credentials"));
    return;
  }
  const userJwt = jwt.sign({ id: existingUser.id, email: existingUser.email }, process.env.JWT_KEY!);
  req.session = { jwt: userJwt };

  res.status(200).send(UserMapper.toDTO(existingUser));
});

export { router as signinRouter };
