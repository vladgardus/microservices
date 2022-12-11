import { TicketCreatedEvent, Patterns, Exchanges, Queues, Subscriber } from "@vgticketingapp/common";
import { Connection, ConsumeMessage } from "amqplib";

export class TicketCreatedSubscriber extends Subscriber<TicketCreatedEvent> {
  onMessageConsumed(msg: ConsumeMessage, data: { id: string; title: string; price: number; userId: string }): void {
    console.log("message receiver", msg);
    console.log("data", data);
  }
  constructor(connection: Connection) {
    super(connection);
  }
  queueName = Queues.TicketCreated;
  exchangeName = Exchanges.Ticket;
  readonly pattern = Patterns.TicketCreated;
}
