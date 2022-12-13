import { Patterns } from "../patterns";

export interface TicketUpdatedEvent {
  pattern: Patterns.TicketUpdated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
    version: number;
    orderId?: string;
  };
}
