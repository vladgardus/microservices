import mongoose from "mongoose";

export interface AcknowledgedEventAttrs {
  message: string;
  timestamp?: Date;
}

interface AcknowledgedEventModel extends mongoose.Model<AcknowledgedEventDoc> {
  build(attrs: AcknowledgedEventAttrs): AcknowledgedEventDoc;
}

class AcknowledgedEventDoc extends mongoose.Document {
  message!: AcknowledgedEventAttrs["message"];
  timestamp!: Date;
}

interface AcknowledgedEventDTO {
  message: string;
  timestamp: Date;
}

export class AcknowledgedEventMapper {
  static toDTO(event: AcknowledgedEventDoc): AcknowledgedEventDTO {
    return { message: event.message, timestamp: event.timestamp };
  }
}

const acknowledgedEventSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});
acknowledgedEventSchema.statics.build = (attrs: AcknowledgedEventDoc) => {
  return new AcknowledgedEvent(attrs);
};

const AcknowledgedEvent = mongoose.model<AcknowledgedEventDoc, AcknowledgedEventModel>("AcknowledgedEvent", acknowledgedEventSchema);

export { AcknowledgedEvent };
