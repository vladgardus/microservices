import { ValidationError } from "express-validator";
import { MiddlewareError } from "./middleware-error";

export class RequestValidationError extends MiddlewareError {
  statusCode = 400;
  constructor(public errors: ValidationError[]) {
    super("Invalid request parameters");
    // only because of extending built in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeError(): { errors: { message: string; field?: string | undefined }[] } {
    return {
      errors: this.errors.map((error) => {
        return { message: error.msg, field: error.param };
      }),
    };
  }
}
