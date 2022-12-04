import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import app from "../app";
import request from "supertest";
import jwt from "jsonwebtoken";

let mongo: MongoMemoryServer;
beforeAll(async () => {
  process.env.JWT_KEY = "asd";
  const mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();
  await mongoose.connect(mongoUri, {});
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
