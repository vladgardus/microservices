import Queue from "bull";
import { amqpWrapper } from "../amqp-wrapper";
import { ExpirationCompletePublisher } from "../events/publishers/expiration-complete-publisher";

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>("order.expiration", { redis: { host: process.env.REDIS_HOST } });

expirationQueue.process(async (job) => {
  const publisher = await new ExpirationCompletePublisher(amqpWrapper.connection).build();
  publisher.publish({ orderId: job.data.orderId });
});

export { expirationQueue };
