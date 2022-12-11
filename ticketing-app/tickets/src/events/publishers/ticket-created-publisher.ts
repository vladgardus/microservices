import { TicketCreatedEvent, Patterns, Publisher, Exchanges, Queues } from "@vgticketingapp/common";
import { Connection } from "amqplib";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  constructor(connection: Connection) {
    super(connection);
  }
  queueName = Queues.TicketCreated;
  exchangeName = Exchanges.Ticket;
  readonly pattern = Patterns.TicketCreated;
}
