import cron from "node-cron";
import { PaymentPublishers } from "../events/init-publishers";
import { PublishEvent } from "../models/publish-event";

const publishEventsJob = (publishers: PaymentPublishers) =>
  cron.schedule("* * * * *", async () => {
    console.log("starting job to publish events");
    let unpublishedEvents = await PublishEvent.find({ isPublished: false }).sort({ timestamp: 1 });
    console.log(`number of events found ${unpublishedEvents.length}`);
    try {
      if (unpublishedEvents.length) {
        for (let event of unpublishedEvents) {
          try {
            console.log(`going to update event with id ${event._id} and pattern ${event.pattern}`, {
              id: event._id,
              isPublished: event.isPublished,
              pattern: event.pattern,
              timestamp: event.timestamp,
            });
            publishers[event.pattern].publish(JSON.parse(event.message));
            await PublishEvent.updateOne({ _id: event._id }, { $set: { isPublished: true } });
          } catch (err) {
            console.log(`failed to update event ${event.id}`);
            continue;
          }
        }
      }
    } catch (err) {
      console.log("couldn't connect to rabbitmq");
    }
  });
export default publishEventsJob;
