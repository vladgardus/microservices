import mongoose from "mongoose";
import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket";

const buildTicket = async () => {
  const ticket = Ticket.build({ title: "test", price: 1, version: 0, id: new mongoose.Types.ObjectId().toHexString() });
  await ticket.save();
  return ticket;
};

it("fetch orders for a particular user", async () => {
  const [ticket1, ticket2, ticket3] = await Promise.all([buildTicket(), buildTicket(), buildTicket()]);
  const user1 = signin();
  const user2 = signin();
  await request(app).post("/api/orders").set("Cookie", user1).send({ ticketId: ticket1._id }).expect(201);
  await request(app).post("/api/orders").set("Cookie", user1).send({ ticketId: ticket2._id }).expect(201);
  await request(app).post("/api/orders").set("Cookie", user2).send({ ticketId: ticket3._id }).expect(201);
  const user1Response = await request(app).get(`/api/orders`).set("Cookie", user1).send({}).expect(200);
  const user2Response = await request(app).get(`/api/orders`).set("Cookie", user2).send({}).expect(200);
  expect(user1Response.body.length).toEqual(2);
  expect(user2Response.body.length).toEqual(1);
});
