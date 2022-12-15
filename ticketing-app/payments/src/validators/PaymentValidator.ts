import { body } from "express-validator";
export default class PaymentValidator {
  static token = body("token", "token is required!").not().isEmpty();
  static orderId = body("orderId", "orderId is required!").not().isEmpty();
  static new = [this.token, this.orderId];
}
