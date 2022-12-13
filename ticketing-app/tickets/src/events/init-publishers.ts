import { Event, Patterns, Publisher } from "@vgticketingapp/common";
import { amqpWrapper } from "../amqp-wrapper";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";

export type TicketPublishers = {
  [key: string]: Publisher<Event>;
};

const initPublishers = async () => {
  let createdPublisher = await new TicketCreatedPublisher(amqpWrapper.connection).build();
  let updatedPublisher = await new TicketUpdatedPublisher(amqpWrapper.connection).build();

  return {
    [Patterns.TicketCreated.toString()]: createdPublisher,
    [Patterns.TicketUpdated.toString()]: updatedPublisher,
  } as TicketPublishers;
};

export default initPublishers;
