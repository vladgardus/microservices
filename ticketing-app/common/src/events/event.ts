import { Patterns } from "./patterns";

export interface Event {
  pattern: Patterns;
  data: { [key: string]: any };
}
