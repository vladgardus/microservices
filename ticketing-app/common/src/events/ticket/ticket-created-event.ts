import { Patterns } from "../patterns";

export interface TicketCreatedEvent {
  pattern: Patterns.TicketCreated;
  data: {
    id: string;
    title: string;
    price: number;
    userId: string;
  };
}
