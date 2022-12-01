import { MiddlewareError } from "./middleware-error";

export class BadRequestError extends MiddlewareError {
  constructor(public message: string) {
    super(message);
    Object.setPrototypeOf(this, BadRequestError.prototype);
  }
  serializeError(): { errors: { message: string; field?: string | undefined }[] } {
    return { errors: [{ message: this.message }] };
  }
  statusCode = 400;
}
