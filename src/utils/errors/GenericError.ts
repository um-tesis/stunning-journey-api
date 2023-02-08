import { BaseError } from './BaseError';

export class GenericError extends BaseError {
  constructor(message: string, errorPlace?: string) {
    super('Generic', message, 400, errorPlace);
  }
}
