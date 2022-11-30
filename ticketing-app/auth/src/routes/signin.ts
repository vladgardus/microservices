import express, { Request, Response } from "express";
import { validationResult } from "express-validator";
import AuthValidators from "../validators/AuthValidator";

const router = express.Router();

router.post("/users/signin", AuthValidators.all, (req: Request, res: Response) => {
  const errors = validationResult(req);
  const { email, password } = req.body;
  if (!errors.isEmpty()) {
    return res.status(400).send(errors.array().map(error => error.msg).join( ));
  }
});

export { router as signinRouter };
