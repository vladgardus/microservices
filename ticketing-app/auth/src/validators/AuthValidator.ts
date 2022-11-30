import { body } from "express-validator";
export default class AuthValidators {
  static email = body("email", "Email is invalid!")
    .isEmail()
    .trim()
    .escape()
    .normalizeEmail();
  static password = body("password")
    .isLength({ min: 8 })
    .withMessage("Password Must Be at Least 8 Characters!")
    .matches("[0-9]")
    .withMessage("Password Must Contain a Number!")
    .matches("[A-Z]")
    .withMessage("Password Must Contain an Uppercase Letter!")
    .trim()
    .escape();
  static all = [this.email, this.password];
}
