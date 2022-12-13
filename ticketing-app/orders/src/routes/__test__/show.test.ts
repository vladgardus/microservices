import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket";

const buildTicket = async () => {
  const ticket = Ticket.build({ title: "test", price: 1, version: 0, id: new mongoose.Types.ObjectId().toHexString() });
  await ticket.save();
  return ticket;
};

it("returns 404 if order is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();
  const response = await request(app).get(`/api/orders/${id}`).set("Cookie", signin()).send({});
  expect(response.status).toEqual(404);
});

it("returns 401 if order belongs to other user", async () => {
  const ticket = await buildTicket();
  const response = await request(app).post("/api/orders").set("Cookie", signin()).send({ ticketId: ticket._id }).expect(201);
  const ticketResponse = await request(app).get(`/api/orders/${response.body.id}`).set("Cookie", signin()).send({}).expect(401);
});

it("returns order if found", async () => {
  const ticket = await buildTicket();
  const user = signin();
  const response = await request(app).post("/api/orders").set("Cookie", user).send({ ticketId: ticket._id }).expect(201);
  await request(app).get(`/api/orders/${response.body.id}`).set("Cookie", user).send({}).expect(200);
});
