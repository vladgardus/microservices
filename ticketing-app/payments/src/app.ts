import express from "express";
import { json } from "body-parser";
import { errorHandler, NotFoundError } from "@vgticketingapp/common";
import cookieSession from "cookie-session";
import cors from "cors";
import { createPaymentRouter } from "./routes/new";
const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(cors({ origin: "*" }));
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);

app.use("/api", createPaymentRouter);

app.all("*", () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export default app;
