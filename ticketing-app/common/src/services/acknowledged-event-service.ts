import mongoose from "mongoose";
import { AcknowledgedEvent } from "../models/acknowledged-event";

const connectToDB = async () => {
  if (mongoose.connection.readyState != 1) {
    await mongoose.connect("mongodb://events-mongo-srv:27017/events");
  }
  return;
};

const saveAcknowledgedEvent = async (message: string) => {
  await connectToDB();
  const newMessage = AcknowledgedEvent.build({ message });
  return newMessage.save();
};

// Function to read all acknowledged messages from the database
const readAcknowledgedEvents = async (timestamp?: Date) => {
  await connectToDB();
  const filters = {} as { timestamp?: { [key: string]: Date } };
  if (timestamp) {
    filters.timestamp = { $gte: timestamp };
  }
  return AcknowledgedEvent.find(filters).sort({ timestamp: 1 }).exec();
};

export { saveAcknowledgedEvent, readAcknowledgedEvents };
