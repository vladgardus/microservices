import request from "supertest";
import app from "../../app";

it("it fails when email doesn't exist in db", async () => {
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "Password1!",
    })
    .expect(400);
});

it("works when emails exists in db", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "Password1!",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "Password1!",
    })
    .expect(200);
});

it("fails when password is different", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "Password1!",
    })
    .expect(201);
  await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "Password1234",
    })
    .expect(400);
});

it("sets cookie after signin", async () => {
  await request(app)
    .post("/api/users/signup")
    .send({
      email: "test@test.com",
      password: "Password1!",
    })
    .expect(201);
  const response = await request(app)
    .post("/api/users/signin")
    .send({
      email: "test@test.com",
      password: "Password1!",
    })
    .expect(200);
  expect(response.get("Set-Cookie")).toBeDefined();
});
