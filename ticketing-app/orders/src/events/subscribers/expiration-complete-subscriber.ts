import { ExpirationCompleteEvent, Patterns, Exchanges, Queues, Subscriber, OrderStatus } from "@vgticketingapp/common";
import { Connection, ConsumeMessage } from "amqplib";
import { amqpWrapper } from "../../amqp-wrapper";
import { Order } from "../../models/order";
import { OrderCanceledPublisher } from "../publishers/order-canceled-publisher";

export class ExpirationCompleteSubscriber extends Subscriber<ExpirationCompleteEvent> {
  async onMessageConsumed(msg: ConsumeMessage, data: ExpirationCompleteEvent["data"]): Promise<void> {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      throw new Error("order not found");
    }
    order.set({ status: OrderStatus.Canceled });
    await order.save();
    let publisher = await new OrderCanceledPublisher(amqpWrapper.connection).build();
    publisher.publish({ id: order.id, version: order.version, ticket: { id: order.ticket.id } });
  }
  constructor(connection: Connection) {
    super(connection);
  }
  queueName = `${Queues.ExpirationComplete}_${process.env.npm_package_name}`;
  exchangeName = Exchanges.Expiration;
  readonly pattern = Patterns.ExpirationComplete;
}
