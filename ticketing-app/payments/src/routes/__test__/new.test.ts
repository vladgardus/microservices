import { OrderStatus, Patterns } from "@vgticketingapp/common";
import request from "supertest";
import app from "../../app";
import { PublishEvent } from "../../models/publish-event";
import { Order } from "../../models/order";
import mongoose from "mongoose";
import { stripe } from "../../stripe";
import { Payment } from "../../models/payment";

it("route handler listening to /api/orders for post requests", async () => {
  const response = await request(app).post("/api/payments").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accesed if user is signed it", async () => {
  const response = await request(app).post("/api/payments").send({});
  expect(response.status).toEqual(401);
});

it("returns a status other that 401 if a user is signed it", async () => {
  const response = await request(app).post("/api/payments").set("Cookie", signin()).send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if the ticket does not exist", async () => {
  const orderId = new mongoose.Types.ObjectId();
  const token = "asdasdassad";
  await request(app).post("/api/payments").set("Cookie", signin()).send({ orderId, token }).expect(400);
});

it("returns bad request if the order doesn't belong to the user", async () => {
  const orderId = new mongoose.Types.ObjectId();
  const token = "asdasdassad";
  const order = Order.build({ id: orderId.toHexString(), price: 100, status: OrderStatus.Created, version: 0, userId: "sadsadasdsa" });
  await order.save();
  await request(app).post("/api/payments").set("Cookie", signin()).send({ orderId, token }).expect(401);
});

it("returns bad request if the order is canceled", async () => {
  const orderId = new mongoose.Types.ObjectId();
  const token = "asdasdassad";
  const userId = new mongoose.Types.ObjectId();
  const order = Order.build({ id: orderId.toHexString(), price: 100, status: OrderStatus.Canceled, version: 0, userId: userId.toHexString() });
  await order.save();
  await request(app).post("/api/payments").set("Cookie", signin(userId.toHexString())).send({ orderId, token }).expect(400);
});

it("creates a payment in stripe", async () => {
  const orderId = new mongoose.Types.ObjectId();
  const token = "tok_visa";
  const userId = new mongoose.Types.ObjectId();
  const price = Math.floor(Math.random() * 10000);
  const order = Order.build({ id: orderId.toHexString(), price, status: OrderStatus.Created, version: 0, userId: userId.toHexString() });
  await order.save();
  await request(app).post("/api/payments").set("Cookie", signin(userId.toHexString())).send({ orderId, token }).expect(200);
  const { data } = await stripe.charges.list({ limit: 50 });
  const payment = data.find((item) => item.amount === price * 100);
  expect(payment).toBeDefined();
  const payments = await Payment.find({});
  expect(payments.length).toEqual(1);
  expect(payments[0].stripeId).toEqual(payment?.id);
});
