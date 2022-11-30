export abstract class MiddlewareError extends Error {
  constructor(message: string) {
    super(message);
    Object.setPrototypeOf(this, MiddlewareError.prototype);
  }
  abstract serializeError(): { errors: { message: string; field?: string }[] };
  abstract statusCode: number;
}
