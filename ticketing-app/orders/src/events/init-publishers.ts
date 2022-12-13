import { Event, Patterns, Publisher } from "@vgticketingapp/common";
import { amqpWrapper } from "../amqp-wrapper";
import { OrderCreatedPublisher } from "../events/publishers/order-created-publisher";
import { OrderCanceledPublisher } from "../events/publishers/order-canceled-publisher";

export type OrderPublishers = {
  [key: string]: Publisher<Event>;
};

const initPublishers = async () => {
  let createdPublisher = await new OrderCreatedPublisher(amqpWrapper.connection).build();
  let canceledPublisher = await new OrderCanceledPublisher(amqpWrapper.connection).build();

  return {
    [Patterns.OrderCreated.toString()]: createdPublisher,
    [Patterns.OrderCanceled.toString()]: canceledPublisher,
  } as OrderPublishers;
};

export default initPublishers;
