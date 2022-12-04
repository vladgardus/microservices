import request from "supertest";
import app from "../../app";

it("can fetch a list of tickets", async () => {
  const title = "concert";
  const price = 20;
  await request(app).post("/api/tickets").set("Cookie", signin()).send({ title, price }).expect(201);
  await request(app).post("/api/tickets").set("Cookie", signin()).send({ title, price }).expect(201);
  await request(app).post("/api/tickets").set("Cookie", signin()).send({ title, price }).expect(201);
  const ticketResponse = await request(app).get(`/api/tickets`).send({}).expect(200);
  expect(ticketResponse.body.length).toEqual(3);
});
