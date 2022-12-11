import { Patterns } from "@vgticketingapp/common";
import cron from "node-cron";
import { amqpWrapper } from "../amqp-wrapper";
import { TicketCreatedPublisher } from "../events/publishers/ticket-created-publisher";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { PublishEvent } from "../models/publish-event";

const publishEventsJob = cron.schedule("* * * * *", async () => {
  console.log("starting job to publish events");
  let unpublishedEvents = await PublishEvent.find({ isPublished: false });
  console.log(`number of events found ${unpublishedEvents.length}`);
  try {
    if (unpublishedEvents.length) {
      let createdEvents = unpublishedEvents.filter((event) => event.pattern == Patterns.TicketCreated);
      console.log(`number of CREATED events found ${createdEvents.length}`);
      if (createdEvents.length) {
        let createdPublisher = await new TicketCreatedPublisher(amqpWrapper.connection).build();
        for (let event of createdEvents) {
          try {
            console.log(`going to update event with id ${event._id}`, { id: event._id, isPublished: event.isPublished, pattern: event.pattern, timestamp: event.timestamp });
            createdPublisher.publish(JSON.parse(event.message));
            await PublishEvent.updateOne({ _id: event._id }, { $set: { isPublished: true } });
          } catch (err) {
            console.log(`failed to update event ${event.id}`);
            continue;
          }
        }
      }
      let updatedEvents = unpublishedEvents.filter((event) => event.pattern == Patterns.TicketUpdated);
      console.log(`number of UPDATED events found ${updatedEvents.length}`);
      if (updatedEvents.length) {
        let updatedPublisher = await new TicketUpdatedPublisher(amqpWrapper.connection).build();
        for (let event of updatedEvents) {
          try {
            console.log(`going to update event with id ${event._id}`, { id: event._id, isPublished: event.isPublished, pattern: event.pattern, timestamp: event.timestamp });
            updatedPublisher.publish(JSON.parse(event.message));
            await PublishEvent.updateOne({ _id: event._id }, { $set: { isPublished: true } });
          } catch (err) {
            console.log(`failed to update event ${event.id}`);
            continue;
          }
        }
      }
    }
  } catch (err) {
    console.log("couldn't connect to rabbitmq");
  }
});
export default publishEventsJob;
