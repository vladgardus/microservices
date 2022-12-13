import { OrderStatus } from "@vgticketingapp/common";
import mongoose from "mongoose";
import { Order } from "./order";

export interface TicketAttrs {
  title: string;
  price: number;
  id: string;
  version: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(attrs: TicketAttrs): TicketDoc;
  findByEvent(id: string, version: number): Promise<TicketDoc | null>;
}

export interface TicketDoc extends mongoose.Document {
  title: string;
  price: number;
  isReserved(): Promise<boolean>;
  version: number;
}

export interface TicketDTO {
  id: string;
  title: string;
  price: number;
  version: number;
}

export class TicketMapper {
  static toDTO(ticket: TicketDoc): TicketDTO {
    return { id: ticket.id, title: ticket.title, price: ticket.price, version: ticket.version };
  }
}

const ticketSchema = new mongoose.Schema({ title: { type: String, required: true }, price: { type: Number, required: true, min: 0 } });
ticketSchema.set("versionKey", "version");
ticketSchema.pre("save", function (done) {
  this.$where = { version: this.get("version") - 1 };
  done();
});
ticketSchema.statics.build = (attrs: TicketAttrs) => {
  return new Ticket({ ...attrs, _id: attrs.id });
};
ticketSchema.statics.findByEvent = (id: string, version: number) => {
  return Ticket.findOne({ _id: id, version: version - 1 });
};

ticketSchema.methods.isReserved = async function () {
  const existingOrder = await Order.findOne({ ticket: this._id, status: { $in: [OrderStatus.Created, OrderStatus.AwaitingPayment, OrderStatus.Complete] } });
  return !!existingOrder;
};

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
