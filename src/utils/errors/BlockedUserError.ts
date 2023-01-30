import {BaseError} from "./BaseError";

export class BlockedUserError extends BaseError {
  constructor(
    message: any,
    errorPlace?: string,
    code?: string,
    data?: unknown
  ) {
    super("Forbidden", message, 403, errorPlace, code, data);
  }
}
