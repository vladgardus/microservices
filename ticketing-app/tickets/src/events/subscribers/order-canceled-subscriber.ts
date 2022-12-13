import { OrderCanceledEvent, Patterns, Exchanges, Queues, Subscriber, DatabaseConnectionError } from "@vgticketingapp/common";
import { Connection, ConsumeMessage } from "amqplib";
import { startSession } from "mongoose";
import { PublishEvent } from "../../models/publish-event";
import { Ticket, TicketMapper } from "../../models/ticket";

export class OrderCanceledSubscriber extends Subscriber<OrderCanceledEvent> {
  async onMessageConsumed(msg: ConsumeMessage, data: OrderCanceledEvent["data"]): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) {
      throw new Error("ticket not found");
    }
    const SESSION = await startSession();
    try {
      SESSION.startTransaction();
      ticket.set({ orderId: undefined });
      await ticket.save();
      const newMessage = PublishEvent.build({ message: JSON.stringify(TicketMapper.toDTO(ticket, undefined)), pattern: Patterns.TicketUpdated });
      await newMessage.save();
      await SESSION.commitTransaction();
    } catch (err) {
      await SESSION.abortTransaction();
      throw new DatabaseConnectionError();
    } finally {
      SESSION.endSession();
    }
  }
  constructor(connection: Connection) {
    super(connection);
  }
  queueName = Queues.OrderCanceled;
  exchangeName = Exchanges.Order;
  readonly pattern = Patterns.OrderCanceled;
}