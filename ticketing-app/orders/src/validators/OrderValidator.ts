import { body } from "express-validator";
export default class TicketValidators {
  static ticketId = body("ticketId", "TicketId is required!").not().isEmpty();
  static new = [this.ticketId];
}
