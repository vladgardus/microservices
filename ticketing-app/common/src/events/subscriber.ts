import { Channel, connect, ConsumeMessage, Connection } from "amqplib";
import { saveAcknowledgedEvent } from "../services/acknowledged-event-service";
import { Event } from "./event";

export abstract class Subscriber<T extends Event> {
  abstract queueName: string; // should be unique per microservice
  abstract exchangeName: string;
  abstract pattern: T["pattern"];
  private connection: Connection;
  abstract onMessageConsumed(msg: ConsumeMessage, data: T["data"]): Promise<void> | void;
  private channel!: Channel;
  constructor(connection: Connection) {
    this.connection = connection;
  }
  build = async () => {
    this.channel = await this.connection.createChannel();
    const exchangeResponse = await this.channel.assertExchange(this.exchangeName, "topic", { durable: true, autoDelete: false });
    const queueResponse = await this.channel.assertQueue(this.queueName, { autoDelete: true, durable: true });
    await this.channel.bindQueue(queueResponse.queue, exchangeResponse.exchange, this.pattern);
    return this;
  };
  listen = async () => {
    return this.channel.consume(this.queueName, async (msg) => {
      console.log(`message received ${this.pattern} / ${this.queueName}`);
      if (!msg) return;
      try {
        let data = JSON.parse(msg.content.toString()) as T["data"];
        await this.onMessageConsumed(msg, data);
        await saveAcknowledgedEvent(msg.content.toString());
        this.channel.ack(msg);
      } catch (err) {
        this.channel.nack(msg, false, true);
      }
    });
  };
}
