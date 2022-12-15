import { amqpWrapper } from "../../../amqp-wrapper";
import { OrderCreatedSubscriber } from "../order-created-subscriber";
import mongoose from "mongoose";
import { ConsumeMessage } from "amqplib";
import { OrderCreatedEvent, OrderStatus, Patterns } from "@vgticketingapp/common";
import { PublishEvent } from "../../../models/publish-event";
import { Order } from "../../../models/order";

const setup = async () => {
  const subscriber = await new OrderCreatedSubscriber(amqpWrapper.connection).build();
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: { id: new mongoose.Types.ObjectId().toHexString(), price: 10 },
  };
  // @ts-ignore
  const message: ConsumeMessage = { content: Buffer.from(JSON.stringify(data)), fields: {}, properties: {} };
  return { subscriber, data, message };
};
it("create order when receiving event", async () => {
  const { subscriber, data, message } = await setup();
  await subscriber.onMessageConsumed(message, data);
  const orders = await Order.find({});
  expect(orders.length).toEqual(1);
  expect(orders[0].price).toEqual(data.ticket.price);
  expect(orders[0]._id.toString()).toEqual(data.id.toString());
//   const events = await PublishEvent.find({});
//   expect(events.length).toEqual(1);
//   expect(events[0].pattern).toEqual(Patterns.TicketUpdated);
});
