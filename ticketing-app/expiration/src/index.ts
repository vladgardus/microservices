import * as dotenv from "dotenv";
import { amqpWrapper } from "./amqp-wrapper";
import { OrderCreatedSubscriber } from "./events/subscribers/order-created-listener";
import doWithRetry from "./helpers/do-with-retry";
dotenv.config();

const start = async () => {
  await doWithRetry(amqpWrapper.connect, 10, 2000);
  process.once("SIGINT", () => {
    console.log("will close amqp connection on signal SIGINT");
    amqpWrapper.connection?.close();
  });
  let subscriber = await new OrderCreatedSubscriber(amqpWrapper.connection).build();
  subscriber.listen();
  // process.once("SIGTERM", () => {
  //   console.log("will close amqp connection on signal SIGTERM");
  //   amqpWrapper.connection?.close();
  // });
};

start().catch(console.error);
