import { Patterns } from "@vgticketingapp/common";
import mongoose from "mongoose";

export interface PublishEventAttrs {
  message: string;
  pattern: Patterns;
  timestamp?: Date;
}

interface PublishEventModel extends mongoose.Model<PublishEventDoc> {
  build(attrs: PublishEventAttrs): PublishEventDoc;
}

class PublishEventDoc extends mongoose.Document {
  message!: PublishEventAttrs["message"];
  pattern!: PublishEventAttrs["pattern"];
  timestamp!: Date;
  isPublished!: boolean;
}

interface PublishEventDTO {
  message: string;
  pattern: Patterns;
  timestamp: Date;
  isPublished: boolean;
}

export class PublishEventMapper {
  static toDTO(event: PublishEventDoc): PublishEventDTO {
    return { message: event.message, pattern: event.pattern, timestamp: event.timestamp, isPublished: event.isPublished };
  }
}

const PublishEventSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  pattern: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  isPublished: {
    type: Boolean,
    default: false,
  },
});
PublishEventSchema.statics.build = (attrs: PublishEventDoc) => {
  console.log("building event with attrs", attrs);
  return new PublishEvent(attrs);
};

const PublishEvent = mongoose.model<PublishEventDoc, PublishEventModel>("PublishEvent", PublishEventSchema);

export { PublishEvent };
