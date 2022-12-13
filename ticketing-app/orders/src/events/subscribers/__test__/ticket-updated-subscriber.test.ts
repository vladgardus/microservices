import { amqpWrapper } from "../../../amqp-wrapper";
import { TicketUpdatedEvent } from "@vgticketingapp/common";
import mongoose from "mongoose";
import { ConsumeMessage } from "amqplib";
import { Ticket } from "../../../models/ticket";
import { TicketUpdatedSubscriber } from "../ticket-updated-subscriber";

const setup = async () => {
  const subscriber = await new TicketUpdatedSubscriber(amqpWrapper.connection).build();
  const ticket = Ticket.build({ id: new mongoose.Types.ObjectId().toHexString(), price: 10, title: "concert", version: 0 });
  await ticket.save();
  const data: TicketUpdatedEvent["data"] = {
    id: ticket._id,
    price: 20,
    title: "concert",
    version: ticket.version + 1,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };
  // @ts-ignore
  const message: ConsumeMessage = { content: Buffer.from(JSON.stringify(data)), fields: {}, properties: {} };
  return { subscriber, data, message };
};
it("finds, updates and saves a ticket", async () => {
  const { subscriber, data, message } = await setup();
  await subscriber.onMessageConsumed(message, data);
  const tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(data.title);
  expect(tickets[0].price).toEqual(data.price);
});

it("throws error if version from event does not correspond", async () => {
  const { subscriber, data, message } = await setup();
  data.version = 100;
  await expect(subscriber.onMessageConsumed(message, data)).rejects.toThrow("ticket not found");
});
