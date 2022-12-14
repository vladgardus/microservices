import { Patterns } from "../patterns";

export interface PaymentCreatedEvent {
  pattern: Patterns.PaymentCreated;
  data: {
    id: string;
    orderId: string;
    stripeId: string;
  };
}
