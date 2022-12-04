import { MiddlewareError } from "./middleware-error";

export class UnauthorizedError extends MiddlewareError {
  constructor(public message: string = "Unauthorized") {
    super(message);
    Object.setPrototypeOf(this, UnauthorizedError.prototype);
  }
  serializeError(): { errors: { message: string; field?: string | undefined }[] } {
    return { errors: [{ message: this.message }] };
  }
  statusCode = 401;
}
