import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import doWithRetry from "../helpers/do-with-retry";
import { amqpWrapper } from "../amqp-wrapper";

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "asd";
  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
  amqpWrapper.eventHost = "localhost";
  await doWithRetry(amqpWrapper.connect, 10, 2000);
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (let c of collections) {
    await c.deleteMany({});
  }
});

afterAll(async () => {
  if (mongo) {
    await mongo.stop();
  }
  await mongoose.connection.close();
});

declare global {
  var signin: () => string[];
}
global.signin = () => {
  const payload = { id: new mongoose.Types.ObjectId().toHexString(), email: "test@test.com" };
  const token = jwt.sign(payload, process.env.JWT_KEY!);
  const base64 = Buffer.from(JSON.stringify({ jwt: token })).toString("base64");
  return [`session=${base64}`];
};
