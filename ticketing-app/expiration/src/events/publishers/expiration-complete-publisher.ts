import { ExpirationCompleteEvent, Patterns, Publisher, Exchanges, Queues } from "@vgticketingapp/common";
import { Connection } from "amqplib";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  constructor(connection: Connection) {
    super(connection);
  }
  queueName = Queues.ExpirationComplete;
  exchangeName = Exchanges.Expiration;
  readonly pattern = Patterns.ExpirationComplete;
}
