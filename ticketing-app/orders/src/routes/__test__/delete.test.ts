import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket";
import { PublishEvent } from "../../models/publish-event";
import { Order } from "../../models/order";
import { OrderStatus, Patterns } from "@vgticketingapp/common";

const buildTicket = async () => {
  const ticket = Ticket.build({ title: "test", price: 1, version: 0, id: new mongoose.Types.ObjectId().toHexString() });
  await ticket.save();
  return ticket;
};

it("returns 404 if id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const ticket = await buildTicket();
  await request(app).delete(`/api/orders/${id}`).set("Cookie", signin()).send({ ticketId: ticket._id }).expect(404);
});

it("returns 401 if user is not authenticated", async () => {
  const ticket = await buildTicket();
  await request(app).delete(`/api/orders/${new mongoose.Types.ObjectId().toHexString()}`).send({ ticketId: ticket._id }).expect(401);
});

it("returns 401 if user does not own the order", async () => {
  const ticket = await buildTicket();
  const response = await request(app).post(`/api/orders`).set("Cookie", signin()).send({ ticketId: ticket._id }).expect(201);
  await request(app).delete(`/api/orders/${response.body.id}`).set("Cookie", signin()).send({}).expect(401);
});

it("marks order as canceled", async () => {
  const ticket = await buildTicket();
  const cookie = signin();
  const response = await request(app).post(`/api/orders`).set("Cookie", cookie).send({ ticketId: ticket._id }).expect(201);
  await request(app).delete(`/api/orders/${response.body.id}`).set("Cookie", cookie).send({}).expect(200);
  const ticketResponse = await request(app).get(`/api/orders/${response.body.id}`).set("Cookie", cookie).send({}).expect(200);
  expect(ticketResponse.body.status).toEqual(OrderStatus.Canceled);
  let events = await PublishEvent.find({});
  expect(events.filter((event) => event.pattern == Patterns.OrderCreated).length).toEqual(1);
  expect(events.filter((event) => event.pattern == Patterns.OrderCanceled).length).toEqual(1);
});
