import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import { DatabaseConnectionError } from "../errors/database-connection-error";
import { RequestValidationError } from "../errors/request-validation-error";
import AuthValidators from "../validators/AuthValidator";

const router = express.Router();

router.post("/users/signup", AuthValidators.all, (req: Request, res: Response) => {
  const errors = validationResult(req);
  const { email, password } = req.body as { email: string; password: string };
  if (!errors.isEmpty()) {
    throw new RequestValidationError(errors.array());
  }
  console.log(`Creating user ${email} ${password}`);
  throw new DatabaseConnectionError();
  res.send({});
});

export { router as signupRouter };
