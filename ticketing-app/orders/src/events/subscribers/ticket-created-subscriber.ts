import { TicketCreatedEvent, Patterns, Exchanges, Queues, Subscriber } from "@vgticketingapp/common";
import { Connection, ConsumeMessage } from "amqplib";
import { Ticket } from "../../models/ticket";

export class TicketCreatedSubscriber extends Subscriber<TicketCreatedEvent> {
  async onMessageConsumed(msg: ConsumeMessage, data: TicketCreatedEvent["data"]): Promise<void> {
    const ticket = Ticket.build(data);
    await ticket.save();
  }
  constructor(connection: Connection) {
    super(connection);
  }
  queueName = Queues.TicketCreated;
  exchangeName = Exchanges.Ticket;
  readonly pattern = Patterns.TicketCreated;
}
