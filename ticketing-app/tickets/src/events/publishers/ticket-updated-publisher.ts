import { TicketUpdatedEvent, Patterns, Publisher, Exchanges, Queues } from "@vgticketingapp/common";
import { Connection } from "amqplib";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  constructor(connection: Connection) {
    super(connection);
  }
  queueName = Queues.TicketUpdated;
  exchangeName = Exchanges.Ticket;
  readonly pattern = Patterns.TicketUpdated;
}
