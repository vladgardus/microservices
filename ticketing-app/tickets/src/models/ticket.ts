import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

interface TicketDoc extends mongoose.Document {
  title: TicketAttrs["title"];
  price: TicketAttrs["price"];
  userId: TicketAttrs["userId"];
  version: number;
  orderId: string;
}

interface TicketDTO {
  id: string;
  title: string;
  price: number;
  userId?: string;
  version: number;
  orderId: string;
}

export class TicketMapper {
  static toDTO(ticket: TicketDoc, requestUserId: string | undefined): TicketDTO {
    const { _id, title, price, userId, version, orderId } = ticket;
    return { id: _id, title, price, userId: requestUserId == userId ? userId : undefined, version, orderId };
  }
}

const ticketSchema = new mongoose.Schema({ title: { type: String, required: true }, price: { type: Number, required: true }, userId: { type: String, required: true }, orderId: { type: String } });
ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
