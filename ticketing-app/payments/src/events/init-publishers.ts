import { Event, Patterns, Publisher } from "@vgticketingapp/common";
import { amqpWrapper } from "../amqp-wrapper";
import { PaymentCreatedPublisher } from "../events/publishers/payment-created-publisher";

export type PaymentPublishers = {
  [key: string]: Publisher<Event>;
};

const initPublishers = async () => {
  let createdPublisher = await new PaymentCreatedPublisher(amqpWrapper.connection).build();

  return {
    [Patterns.PaymentCreated.toString()]: createdPublisher,
  } as PaymentPublishers;
};

export default initPublishers;
