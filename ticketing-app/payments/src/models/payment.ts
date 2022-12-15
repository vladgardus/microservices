import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

export interface PaymentAttrs {
  orderId: string;
  stripeId: string;
}

interface PaymentModel extends mongoose.Model<PaymentDoc> {
  build(attrs: PaymentAttrs): PaymentDoc;
}

interface PaymentDoc extends mongoose.Document {
  orderId: string;
  stripeId: string;
}

interface PaymentDTO {
  orderId: string;
  stripeId: string;
}

export class PaymentMapper {
  static toDTO(payment: PaymentDoc): PaymentDTO {
    const { orderId, stripeId } = payment;
    return { orderId, stripeId };
  }
}

const paymentSchema = new mongoose.Schema({
  orderId: { type: String, required: true },
  stripeId: { type: String, required: true },
});
paymentSchema.set("versionKey", "version");
paymentSchema.plugin(updateIfCurrentPlugin);
paymentSchema.statics.build = (attrs: PaymentAttrs) => {
  return new Payment({ ...attrs });
};

const Payment = mongoose.model<PaymentDoc, PaymentModel>("Payment", paymentSchema);

export { Payment };
