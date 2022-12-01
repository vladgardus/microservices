import express, { NextFunction, Request, Response } from "express";
import { BadRequestError } from "../errors/bad-request-error";
import { User, UserAttrs, UserMapper } from "../models/user";
import AuthValidators from "../validators/AuthValidator";
import jwt from "jsonwebtoken";
import { validateRequest } from "../middlewares/validate-request";

const router = express.Router();

router.post("/users/signup", AuthValidators.all, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
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
