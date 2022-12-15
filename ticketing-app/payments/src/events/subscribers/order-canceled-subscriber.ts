import { OrderCanceledEvent, Patterns, Exchanges, Queues, Subscriber, DatabaseConnectionError, OrderStatus } from "@vgticketingapp/common";
import { Connection, ConsumeMessage } from "amqplib";
import { startSession } from "mongoose";
import { Order, OrderMapper } from "../../models/order";
import { PublishEvent } from "../../models/publish-event";

export class OrderCanceledSubscriber extends Subscriber<OrderCanceledEvent> {
  async onMessageConsumed(msg: ConsumeMessage, data: OrderCanceledEvent["data"]): Promise<void> {
    const order = await Order.findByEvent(data.id, data.version);
    if (!order) {
      throw new Error("order not found");
    }

    const SESSION = await startSession();
    try {
      SESSION.startTransaction();
      order.set({ status: OrderStatus.Canceled });
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
  queueName = `${Queues.OrderCanceled}_${process.env.npm_package_name}`;
  exchangeName = Exchanges.Order;
  readonly pattern = Patterns.OrderCanceled;
}
