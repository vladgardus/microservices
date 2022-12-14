import { Patterns } from "@vgticketingapp/common";
import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { PublishEvent } from "../../models/publish-event";
import { Ticket } from "../../models/ticket";

const amqplib = require("amqplib-mocks");
jest.setMock("amqplib", amqplib);

it("returns 404 if id does not exist", async () => {
  const title = "concert";
  const price = 20;
  const id = new mongoose.Types.ObjectId().toHexString();
  await request(app).put(`/api/tickets/${id}`).set("Cookie", signin()).send({ title, price }).expect(404);
});

it("returns 401 if user is not authenticated", async () => {
  const title = "concert";
  const price = 20;
  await request(app).put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`).send({ title, price }).expect(401);
});

it("returns 401 if user does not own the ticket", async () => {
  const title = "concert";
  const price = 20;
  const response = await request(app).post(`/api/tickets`).set("Cookie", signin()).send({ title, price }).expect(201);
  await request(app).put(`/api/tickets/${response.body.id}`).set("Cookie", signin()).send({ title, price }).expect(401);
});

it("returns 400 if a user provides invalid title or price", async () => {
  const title = "concert";
  const price = 20;
  const cookie = signin();
  const response = await request(app).post(`/api/tickets`).set("Cookie", cookie).send({ title, price }).expect(201);
  await request(app).put(`/api/tickets/${response.body.id}`).set("Cookie", signin()).send({ title: "", price }).expect(400);
});

it("updates the ticket with the provided valid inputs", async () => {
  const title = "concert";
  const price = 20;
  const newTitle = "new concert";
  const cookie = signin();
  const response = await request(app).post(`/api/tickets`).set("Cookie", cookie).send({ title, price }).expect(201);
  await request(app).put(`/api/tickets/${response.body.id}`).set("Cookie", cookie).send({ title: newTitle, price }).expect(200);
  const ticketResponse = await request(app).get(`/api/tickets/${response.body.id}`).send({}).expect(200);
  expect(ticketResponse.body.title).toEqual(newTitle);
  expect(ticketResponse.body.price).toEqual(price);
  let events = await PublishEvent.find({});
  expect(events.filter((event) => event.pattern == Patterns.TicketCreated).length).toEqual(1);
  expect(events.filter((event) => event.pattern == Patterns.TicketUpdated).length).toEqual(1);
});

it("rejects updates if ticket is reserver", async () => {
  const title = "concert";
  const newTitle = "sadasdsadas";
  const price = 20;
  const cookie = signin();
  const response = await request(app).post(`/api/tickets`).set("Cookie", cookie).send({ title, price }).expect(201);
  const ticket = await Ticket.findById(response.body.id);
  ticket?.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
  await ticket?.save();
  await request(app).put(`/api/tickets/${response.body.id}`).set("Cookie", cookie).send({ title: newTitle }).expect(400);
});
