import { OrderCreatedEvent, Patterns, Exchanges, Queues, Subscriber, DatabaseConnectionError } from "@vgticketingapp/common";
import { Connection, ConsumeMessage } from "amqplib";
import { expirationQueue } from "../../queues/expiration-queue";

export class OrderCreatedSubscriber extends Subscriber<OrderCreatedEvent> {
  async onMessageConsumed(msg: ConsumeMessage, data: OrderCreatedEvent["data"]): Promise<void> {
    let delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    await expirationQueue.add({ orderId: data.id }, { delay });
  }
  constructor(connection: Connection) {
    super(connection);
  }
  queueName = `${Queues.OrderCreated}_${process.env.npm_package_name}`;
  exchangeName = Exchanges.Order;
  readonly pattern = Patterns.OrderCreated;
}
