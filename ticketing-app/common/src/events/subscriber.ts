import { Channel, connect, ConsumeMessage } from "amqplib";
import { Event } from "./event";

export abstract class Subscriber<T extends Event> {
  abstract queueName: string; // should be unique per microservice
  abstract exchangeName: string;
  abstract pattern: T["pattern"];
  abstract onMessageConsumed(msg: ConsumeMessage, data: T["data"]): Promise<void> | void;
  private channel!: Channel;
  protected eventBusHost = "rabbitmq-srv";
  constructor() {}
  async build() {
    const connection = await connect(`amqp://${this.eventBusHost}:5672`);
    process.once("SIGINT", () => {
      connection.close();
    });
    process.once("SIGTERM", () => {
      connection.close();
    });
    this.channel = await connection.createChannel();
    const exchangeResponse = await this.channel.assertExchange(this.exchangeName, "topic", { durable: true, autoDelete: false });
    const queueResponse = await this.channel.assertQueue(this.queueName, { autoDelete: true, durable: true });
    await this.channel.bindQueue(queueResponse.queue, exchangeResponse.exchange, this.pattern);
    return this;
  }
  async listen() {
    return this.channel.consume(this.queueName, async (msg) => {
      console.log(`message received ${this.pattern} / ${this.queueName}`);
      if (!msg) return;
      try {
        let data = JSON.parse(msg.content.toString()) as T["data"];
        await this.onMessageConsumed(msg, data);
      } catch (err) {
        this.channel.nack(msg, false, true);
      }
    });
  }
}
