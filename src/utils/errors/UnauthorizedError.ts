import { BaseError } from './BaseError';

export class UnauthorizedError extends BaseError {
  constructor(message: string, errorPlace?: string) {
    super('Unauthorized', message, 401, errorPlace);
  }
}
