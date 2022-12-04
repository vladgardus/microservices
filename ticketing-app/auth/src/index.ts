import mongoose from "mongoose";
import app from "./app";
import * as dotenv from "dotenv";
dotenv.config();

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY must be defined");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
  } catch (err) {
    console.error(err);
  }

  app.listen(3000, () => {
    console.log("Listening on 3000");
  });
};

start().catch(console.error);
