import { Patterns } from "../patterns";

export interface OrderCanceledEvent {
  pattern: Patterns.OrderCanceled;
  data: {
    id: string;
    version: number;
    ticket: {
      id: string;
    };
  };
}
