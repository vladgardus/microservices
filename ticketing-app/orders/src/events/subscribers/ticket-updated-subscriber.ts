import { TicketUpdatedEvent, Patterns, Exchanges, Queues, Subscriber } from "@vgticketingapp/common";
import { Connection, ConsumeMessage } from "amqplib";
import { Ticket, TicketDoc } from "../../models/ticket";

export class TicketUpdatedSubscriber extends Subscriber<TicketUpdatedEvent> {
  async onMessageConsumed(msg: ConsumeMessage, data: TicketUpdatedEvent["data"]): Promise<void> {
    let ticket = await Ticket.findByEvent(data.id, data.version);
    if (!ticket) {
      console.log(`going to reject ticket with id ${data.id} and version ${data.version}`);
      throw new Error("ticket not found");
    } else {
      ticket.set({ title: data.title, price: data.price, version: data.version });
    }
    await ticket.save();
  }
  constructor(connection: Connection) {
    super(connection);
  }
  queueName = `${Queues.TicketUpdated}_${process.env.npm_package_name}`;
  exchangeName = Exchanges.Ticket;
  readonly pattern = Patterns.TicketUpdated;
}
