import { BaseError } from './BaseError';

export class BlockedUserError extends BaseError {
  constructor(message: string, errorPlace?: string, code?: string, data?: unknown) {
    super('Forbidden', message, 403, errorPlace, code, data);
  }
}
