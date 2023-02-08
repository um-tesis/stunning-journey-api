import { BaseError } from './BaseError';

export class NotFoundError extends BaseError {
  constructor(message?: string, errorPlace?: string) {
    super('NotFound', message || 'Resource not found', 404, errorPlace);
  }
}
