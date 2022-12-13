import { OrderCreatedEvent, Patterns, Publisher, Exchanges, Queues } from "@vgticketingapp/common";
import { Connection } from "amqplib";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  constructor(connection: Connection) {
    super(connection);
  }
  queueName = Queues.OrderCreated;
  exchangeName = Exchanges.Order;
  readonly pattern = Patterns.OrderCreated;
}
