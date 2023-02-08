export class BaseError extends Error {
  public readonly status: number;

  public readonly errorPlace?: string;

  public readonly code?: string;

  public readonly data?: unknown;

  constructor(name: string, message: string, status: number, errorPlace?: string, code?: string, data?: unknown) {
    super(message);
    this.name = name;
    this.status = status;
    this.errorPlace = errorPlace;
    this.code = code;
    this.data = data;
  }
}
