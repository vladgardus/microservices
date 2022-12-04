import request from "supertest";
import app from "../../app";
import { Ticket } from "../../models/ticket";

it("route handler listening to /api/tickets for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accesed if user is signed it", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).toEqual(401);
});

it("returns a status other that 401 if a user is signed it", async () => {
  const response = await request(app).post("/api/tickets").set("Cookie", signin()).send({});
  expect(response.status).not.toEqual(401);
});

it("returns error if invalid title is provided", async () => {
  await request(app).post("/api/tickets").set("Cookie", signin()).send({ title: "", price: 10 }).expect(400);
  await request(app).post("/api/tickets").set("Cookie", signin()).send({ price: 10 }).expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app).post("/api/tickets").set("Cookie", signin()).send({ title: "adsadasdasdasdsa", price: -10 }).expect(400);
  await request(app).post("/api/tickets").set("Cookie", signin()).send({ title: "adsdaadsaassdas" }).expect(400);
});

it("creates a ticket with valid inputs", async () => {
  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0);
  await request(app).post("/api/tickets").set("Cookie", signin()).send({ title: "adsadasdasdasdsa", price: 10 }).expect(201);
  tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].price).toEqual(10);
});
