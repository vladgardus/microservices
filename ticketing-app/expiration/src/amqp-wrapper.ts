import { connect, Connection } from "amqplib";

class AmqpWrapper {
  private conn?: Connection;
  public eventHost = "rabbitmq-cluster";
  constructor() {
    Object.setPrototypeOf(this, AmqpWrapper.prototype);
  }
  connect = async () => {
    if (this.conn) {
      console.log("already connected", this.conn);
      return;
    }
    console.log("going to connect to " + `amqp://${this.eventHost}:5672`);
    this.conn = await connect(`amqp://${this.eventHost}:5672`);
    console.log("connected to rabbitmq");
    return;
  };
  get connectionActive() {
    return !!this.conn;
  }
  get connection() {
    if (!this.conn) throw new Error("cannot access client before connecting");
    return this.conn;
  }
}

export const amqpWrapper = new AmqpWrapper();
