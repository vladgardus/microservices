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
  }
  build = async () => {
    try {
      console.log("this in build ", this);
      this.channel = await this.connection.createChannel();
      console.log("channel created ", this.channel);
      const exchangeResponse = await this.channel.assertExchange(this.exchangeName, "topic", { durable: true, autoDelete: false });
      console.log("exchange created");
      const queueResponse = await this.channel.assertQueue(this.queueName, { autoDelete: true, durable: true });
      console.log("queue created");
      await this.channel.bindQueue(queueResponse.queue, exchangeResponse.exchange, this.pattern);
      console.log("queue binded");
    } catch (err) {
      console.error(err);
    }
    return this;
  };

  publish = (data: T["data"]) => {
    console.log("this in publish ", this);
    return this.channel.publish(this.exchangeName, this.pattern, Buffer.from(JSON.stringify(data)));
  };
}
