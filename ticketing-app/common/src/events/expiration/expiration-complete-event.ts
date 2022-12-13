import { Patterns } from "../patterns";

export interface ExpirationCompleteEvent {
  pattern: Patterns.ExpirationComplete;
  data: {
    orderId: string;
  };
}
