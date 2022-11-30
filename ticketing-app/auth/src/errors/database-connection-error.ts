import { MiddlewareError } from "./middleware-error";

export class DatabaseConnectionError extends MiddlewareError {
  reason = "Failed to connect to database";
  statusCode = 500;
  constructor() {
    super("Failed to connect to db");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }
  serializeError(): { errors: { message: string; field?: string | undefined }[] } {
    return { errors: [{ message: this.reason }] };
  }
}
