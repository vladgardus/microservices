import request from "supertest";
import app from "../../app";

const amqplib = require("amqplib-mocks");
jest.setMock("amqplib", amqplib);

it("can fetch a list of tickets", async () => {
  const title = "concert";
  const price = 20;
  console.log("going to insert")
  await request(app).post("/api/tickets").set("Cookie", signin()).send({ title, price }).expect(201);
  console.log("going to insert")
  await request(app).post("/api/tickets").set("Cookie", signin()).send({ title, price }).expect(201);
  console.log("going to insert")
  await request(app).post("/api/tickets").set("Cookie", signin()).send({ title, price }).expect(201);
  console.log("going to get all")
  const ticketResponse = await request(app).get(`/api/tickets`).send({}).expect(200);
  expect(ticketResponse.body.length).toEqual(3);
});
