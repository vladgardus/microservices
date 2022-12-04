import { body } from "express-validator";
export default class AuthValidators {
  static email = body("email", "Email is invalid!").isEmail().trim().escape().normalizeEmail({ gmail_remove_dots: false });
  static password_full = body("password")
    .isLength({ min: 8 })
    .withMessage("Password Must Be at Least 8 Characters!")
    .matches("[0-9]")
    .withMessage("Password Must Contain a Number!")
    .matches("[A-Z]")
    .withMessage("Password Must Contain an Uppercase Letter!")
    .trim()
    .escape();
  static password_nonempty = body("password").notEmpty().withMessage("You must supply a password!").trim().escape();
  static signup = [this.email, this.password_full];
  static signin = [this.email, this.password_nonempty];
}
