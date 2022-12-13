import { OrderStatus, Patterns } from "@vgticketingapp/common";
import request from "supertest";
import app from "../../app";
import { PublishEvent } from "../../models/publish-event";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";

it("route handler listening to /api/orders for post requests", async () => {
  const response = await request(app).post("/api/orders").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accesed if user is signed it", async () => {
  const response = await request(app).post("/api/orders").send({});
  expect(response.status).toEqual(401);
});

it("returns a status other that 401 if a user is signed it", async () => {
  const response = await request(app).post("/api/orders").set("Cookie", signin()).send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if the ticket does not exist", async () => {
  const ticketId = new mongoose.Types.ObjectId();
  await request(app).post("/api/orders").set("Cookie", signin()).send({ ticketId }).expect(400);
});

it("returns an error if the ticket is aleady reserved", async () => {
  const ticket = Ticket.build({ title: "test", price: 1000, version: 0, id: new mongoose.Types.ObjectId().toHexString() });
  await ticket.save();
  const order = Order.build({ ticket, userId: "asdsaas", status: OrderStatus.Created, expiresAt: new Date() });
  await order.save();
  await request(app).post("/api/orders").set("Cookie", signin()).send({ ticketId: ticket._id }).expect(400);
});

it("creates an order with valid inputs", async () => {
  const ticket = Ticket.build({ title: "test", price: 1000, version: 0, id: new mongoose.Types.ObjectId().toHexString() });
  await ticket.save();
  await request(app).post("/api/orders").set("Cookie", signin()).send({ ticketId: ticket._id }).expect(201);
  let events = await PublishEvent.find({});
  expect(events.length).toEqual(1);
  expect(events[0].pattern).toEqual(Patterns.OrderCreated);
});
