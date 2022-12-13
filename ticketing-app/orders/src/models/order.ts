import { OrderStatus } from "@vgticketingapp/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { TicketDoc, TicketDTO, TicketMapper } from "./ticket";

export interface OrderAttrs {
  userId: string;
  status: OrderStatus;
  expiresAt: Date;
  ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
}

interface OrderDoc extends mongoose.Document {
  userId: OrderAttrs["userId"];
  status: OrderAttrs["status"];
  expiresAt: OrderAttrs["expiresAt"];
  ticket: OrderAttrs["ticket"];
  version: number;
}

interface OrderDTO {
  id: string;
  userId: string;
  status: OrderStatus;
  expiresAt: string;
  ticket: TicketDTO;
  version: number;
}

export class OrderMapper {
  static toDTO(order: OrderDoc, requestUserId: string | undefined): OrderDTO {
    return {
      id: order._id,
      expiresAt: order.expiresAt.toISOString(),
      status: order.status,
      userId: order.userId,
      ticket: TicketMapper.toDTO(order.ticket),
      version: order.version,
    };
  }
}

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  status: { type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.Created },
  expiresAt: { type: mongoose.Schema.Types.Date },
  ticket: { type: mongoose.Schema.Types.ObjectId, ref: "Ticket" },
});
orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
