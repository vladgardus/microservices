import { OrderCanceledEvent, Patterns, Publisher, Exchanges, Queues } from "@vgticketingapp/common";
import { Connection } from "amqplib";

export class OrderCanceledPublisher extends Publisher<OrderCanceledEvent> {
  constructor(connection: Connection) {
    super(connection);
  }
  queueName = Queues.OrderCanceled;
  exchangeName = Exchanges.Order;
  readonly pattern = Patterns.OrderCanceled;
}
