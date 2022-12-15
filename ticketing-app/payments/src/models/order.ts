import { OrderStatus } from "@vgticketingapp/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface OrderAttrs {
  id: string;
  status: OrderStatus;
  price: number;
  userId: string;
  version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(attrs: OrderAttrs): OrderDoc;
  findByEvent(id: string, version: number): Promise<OrderDoc | null>;
}

interface OrderDoc extends mongoose.Document {
  status: OrderStatus;
  price: number;
  userId: string;
  version: number;
}

interface OrderDTO {
  status: OrderStatus;
  price: number;
  userId: string;
  version: number;
}

export class OrderMapper {
  static toDTO(order: OrderDoc): OrderDTO {
    const { status, userId, version, price } = order;
    return { status, userId, version, price };
  }
}

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  price: { type: Number, required: true },
  status: { type: String, required: true, enum: Object.values(OrderStatus), default: OrderStatus.Created },
});
orderSchema.set("versionKey", "version");
orderSchema.plugin(updateIfCurrentPlugin);
orderSchema.statics.build = (attrs: OrderAttrs) => {
  return new Order({ ...attrs, _id: attrs.id });
};
orderSchema.statics.findByEvent = (id: string, version: number) => {
  return Order.findOne({ _id: id, version: version - 1 });
};

const Order = mongoose.model<OrderDoc, OrderModel>("Order", orderSchema);

export { Order };
