import { Patterns } from "../patterns";
import { OrderStatus } from "../types/order-status";

export interface OrderCreatedEvent {
  pattern: Patterns.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    version: number;
    ticket: {
      id: string;
      price: number;
    };
  };
}
