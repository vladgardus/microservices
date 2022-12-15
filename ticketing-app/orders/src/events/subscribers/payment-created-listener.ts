import { PaymentCreatedEvent, Patterns, Exchanges, Queues, Subscriber, OrderStatus } from "@vgticketingapp/common";
import { Connection, ConsumeMessage } from "amqplib";
import { amqpWrapper } from "../../amqp-wrapper";
import { Order } from "../../models/order";
import { OrderCanceledPublisher } from "../publishers/order-canceled-publisher";

export class PaymentCreatedSubscriber extends Subscriber<PaymentCreatedEvent> {
  async onMessageConsumed(msg: ConsumeMessage, data: PaymentCreatedEvent["data"]): Promise<void> {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error("order not found");
    }
    order.set({ status: OrderStatus.Complete });
    await order.save();
    // let publisher = await new OrderU(amqpWrapper.connection).build();
    // publisher.publish({ id: order.id, version: order.version, ticket: { id: order.ticket.id } });
  }
  constructor(connection: Connection) {
    super(connection);
  }
  queueName = `${Queues.PaymentCreated}_${process.env.npm_package_name}`;
  exchangeName = Exchanges.Payment;
  readonly pattern = Patterns.PaymentCreated;
}
