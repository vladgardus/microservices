import { body } from "express-validator";
export default class TicketValidators {
  static title = body("title", "Title is required!").not().isEmpty();
  static price = body("price", "Price must be greater than 0!").isFloat({ gt: 0 });
  static all = [this.title, this.price];
}
