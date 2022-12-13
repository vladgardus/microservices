import mongoose from "mongoose";
import app from "./app";
import * as dotenv from "dotenv";
import { amqpWrapper } from "./amqp-wrapper";
import doWithRetry from "./helpers/do-with-retry";
import publishEventsJob from "./jobs/publish-events.job";
import { TicketCreatedSubscriber } from "./events/subscribers/ticket-created-subscriber";
import { TicketUpdatedSubscriber } from "./events/subscribers/ticket-updated-subscriber";
import initPublishers from "./events/init-publishers";
import { ExpirationCompleteSubscriber } from "./events/subscribers/expiration-complete-subscriber";
dotenv.config();

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI must be defined");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error(err);
  }

  await doWithRetry(amqpWrapper.connect, 10, 2000);

  const publishers = await initPublishers();

  publishEventsJob(publishers).start();

  const createdSubscriber = await new TicketCreatedSubscriber(amqpWrapper.connection).build();
  createdSubscriber.listen();

  const updatedSubscriber = await new TicketUpdatedSubscriber(amqpWrapper.connection).build();
  updatedSubscriber.listen();

  const expirationListener = await new ExpirationCompleteSubscriber(amqpWrapper.connection).build();
  expirationListener.listen();

  process.once("SIGINT", () => {
    console.log("will close amqp connection on signal SIGINT");
    amqpWrapper.connection?.close();
  });
  // process.once("SIGTERM", () => {
  //   console.log("will close amqp connection on signal SIGTERM");
  //   amqpWrapper.connection?.close();
  // });

  app.listen(3000, () => {
    console.log("Listening on 3000");
  });
};

start().catch(console.error);
