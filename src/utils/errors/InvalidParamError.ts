import { BaseError } from './BaseError';

export class InvalidParamError extends BaseError {
  constructor(message: string, errorPlace?: string) {
    super('InvalidParams', message, 400, errorPlace);
  }
}
