import { PaymentCreatedEvent, Patterns, Publisher, Exchanges, Queues } from "@vgticketingapp/common";
import { Connection } from "amqplib";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  constructor(connection: Connection) {
    super(connection);
  }
  queueName = Queues.PaymentCreated;
  exchangeName = Exchanges.Payment;
  readonly pattern = Patterns.PaymentCreated;
}
