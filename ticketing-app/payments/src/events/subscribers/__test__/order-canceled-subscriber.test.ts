import { amqpWrapper } from "../../../amqp-wrapper";
import mongoose from "mongoose";
import { ConsumeMessage } from "amqplib";
import { OrderCanceledEvent, OrderCreatedEvent, OrderStatus, Patterns } from "@vgticketingapp/common";
import { PublishEvent } from "../../../models/publish-event";
import { Order } from "../../../models/order";
import { OrderCanceledSubscriber } from "../order-canceled-subscriber";

const setup = async () => {
  const subscriber = await new OrderCanceledSubscriber(amqpWrapper.connection).build();
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    version: 0,
  });
  await order.save();
  const data: OrderCanceledEvent["data"] = {
    id: order._id,
    version: 1,
    ticket: { id: new mongoose.Types.ObjectId().toHexString() },
  };
  // @ts-ignore
  const message: ConsumeMessage = { content: Buffer.from(JSON.stringify(data)), fields: {}, properties: {} };
  return { subscriber, data, message };
};
it("cancel order when receiving event", async () => {
  const { subscriber, data, message } = await setup();
  await subscriber.onMessageConsumed(message, data);
  const orders = await Order.find({});
  expect(orders.length).toEqual(1);
  expect(orders[0].status).toEqual(OrderStatus.Canceled);
  //   const events = await PublishEvent.find({});
  //   expect(events.length).toEqual(1);
  //   expect(events[0].pattern).toEqual(Patterns.TicketUpdated);
});
