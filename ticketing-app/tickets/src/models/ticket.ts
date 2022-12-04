import mongoose from "mongoose";

export interface TicketAttrs {
  title: string;
  price: number;
  userId: string;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
}

class TicketDoc extends mongoose.Document {
  title!: TicketAttrs["title"];
  price!: TicketAttrs["price"];
  userId!: TicketAttrs["userId"];
}

interface TicketDTO {
  id: string;
  title: string;
  price: number;
  userId?: string;
}

export class TicketMapper {
  static toDTO(ticket: TicketDoc, requestUserId: string | undefined): TicketDTO {
    return { id: ticket._id, title: ticket.title, price: ticket.price, userId: requestUserId == ticket.userId ? ticket.userId : undefined };
  }
}

const ticketSchema = new mongoose.Schema({ title: { type: String, required: true }, price: { type: Number, required: true }, userId: { type: String, required: true } });
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket(attrs);
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
