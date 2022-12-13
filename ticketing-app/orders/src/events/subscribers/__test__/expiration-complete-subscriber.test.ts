import { amqpWrapper } from "../../../amqp-wrapper";
import { ConsumeMessage } from "amqplib";
import { Ticket } from "../../../models/ticket";
import { ExpirationCompleteSubscriber } from "../expiration-complete-subscriber";
import { ExpirationCompleteEvent, OrderStatus } from "@vgticketingapp/common";
import { Order } from "../../../models/order";
import mongoose from "mongoose";

const setup = async () => {
  const subscriber = await new ExpirationCompleteSubscriber(amqpWrapper.connection).build();

  const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), price: 10, title: "concert", version: 0 });
  await ticket.save();
  const order = Order.build({ expiresAt: new Date(), status: OrderStatus.Created, userId: "adasdasas", ticket });
  await order.save();
  const data: ExpirationCompleteEvent["data"] = { orderId: order.id };
  // @ts-ignore
  const message: ConsumeMessage = { content: Buffer.from(JSON.stringify(data)), fields: {}, properties: {} };
  return { subscriber, data, message };
};
it("creates an order and cancels it", async () => {
  const { subscriber, data, message } = await setup();
  await subscriber.onMessageConsumed(message, data);
  const orders = await Order.find({});
  expect(orders.length).toEqual(1);
  expect(orders[0].status).toEqual(OrderStatus.Canceled);
});
