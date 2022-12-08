import { Channel, connect, Connection } from "amqplib";
import { Event } from "./event";

export abstract class Publisher<T extends Event> {
  abstract queueName: string; // should be unique per microservice
  abstract exchangeName: string;
  abstract pattern: T["pattern"];
  private connection: Connection;
  private channel!: Channel;
  constructor(connection: Connection) {
    this.connection = connection;
    Object.setPrototypeOf(this, Publisher.prototype);
  }
  async build() {
    this.channel = await this.connection.createChannel();
    const exchangeResponse = await this.channel.assertExchange(this.exchangeName, "topic", { durable: true, autoDelete: false });
    const queueResponse = await this.channel.assertQueue(this.queueName, { autoDelete: true, durable: true });
    await this.channel.bindQueue(queueResponse.queue, exchangeResponse.exchange, this.pattern);
    return this;
  }

  publish(data: T["data"]) {
    return this.channel.publish(this.exchangeName, this.pattern, Buffer.from(JSON.stringify(data)));
  }
}
