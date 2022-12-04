import { MiddlewareError } from "./middleware-error";

export class NotFoundError extends MiddlewareError {
  constructor() {
    super("Route not found");
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
  serializeError(): { errors: { message: string; field?: string | undefined }[] } {
    return { errors: [{ message: "Route not found" }] };
  }
  statusCode = 404;
}
