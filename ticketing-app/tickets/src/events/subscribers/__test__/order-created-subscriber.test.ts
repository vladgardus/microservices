import { amqpWrapper } from "../../../amqp-wrapper";
import { OrderCreatedSubscriber } from "../order-created-subscriber";
import mongoose from "mongoose";
import { ConsumeMessage } from "amqplib";
import { Ticket } from "../../../models/ticket";
import { OrderCreatedEvent, OrderStatus, Patterns } from "@vgticketingapp/common";
import { PublishEvent } from "../../../models/publish-event";

const setup = async () => {
  const subscriber = await new OrderCreatedSubscriber(amqpWrapper.connection).build();
  const ticket = Ticket.build({ price: 10, title: "concert", userId: "asdadsa" });
  await ticket.save();
  const data: OrderCreatedEvent["data"] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    version: 0,
    ticket: { id: ticket.id, price: ticket.price },
  };
  // @ts-ignore
  const message: ConsumeMessage = { content: Buffer.from(JSON.stringify(data)), fields: {}, properties: {} };
  return { subscriber, data, message };
};
it("saves order on ticket to lock it", async () => {
  const { subscriber, data, message } = await setup();
  await subscriber.onMessageConsumed(message, data);
  const tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].orderId).toEqual(data.id);
  const events = await PublishEvent.find({});
  expect(events.length).toEqual(1);
  expect(events[0].pattern).toEqual(Patterns.TicketUpdated);
  expect(JSON.parse(events[0].message).orderId).toEqual(data.id);
});
