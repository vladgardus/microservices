import { OrderCreatedEvent, Patterns, Exchanges, Queues, Subscriber, DatabaseConnectionError } from "@vgticketingapp/common";
import { Connection, ConsumeMessage } from "amqplib";
import { startSession } from "mongoose";
import { Order, OrderMapper } from "../../models/order";
import { PublishEvent } from "../../models/publish-event";

export class OrderCreatedSubscriber extends Subscriber<OrderCreatedEvent> {
  async onMessageConsumed(msg: ConsumeMessage, data: OrderCreatedEvent["data"]): Promise<void> {
    const order = Order.build({ ...data, price: data.ticket.price });

    const SESSION = await startSession();
    try {
      SESSION.startTransaction();
      await order.save();
    //   const newMessage = PublishEvent.build({ message: JSON.stringify(OrderMapper.toDTO(order)), pattern: Patterns.TicketUpdated });
    //   await newMessage.save();
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
  queueName = `${Queues.OrderCreated}_${process.env.npm_package_name}`;
  exchangeName = Exchanges.Order;
  readonly pattern = Patterns.OrderCreated;
}
