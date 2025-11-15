import { ErrorCode } from '../../common';

export interface ErrorOptions {
  clientMessage?: string;
  logMessage?: string;
  errorCode?: ErrorCode;
  statusCode?: number;
  reasonPhrase?: string;
  operation?: string
  cause?: unknown;
  context?: unknown;
  error?: unknown;
}

export abstract class ApplicationError extends Error {
  abstract statusCode: number;
  abstract reasonPhrase: string;
  abstract status: 'fail' | 'error';
  clientMessage?: string;
  errorCode?: ErrorCode;
  operation?: string;
  cause?: unknown;
  context?: unknown;
  error?: unknown;

  constructor(options: ErrorOptions) {
    super(options.logMessage ?? options.clientMessage);
    this.name = new.target.name;
    this.clientMessage = options.clientMessage;
    this.errorCode = options.errorCode;
    this.operation = options.operation ?? 'unknown';
    this.cause = options.cause;
    this.context = options.context;
    this.error = options.error;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  private serializeCause(cause: unknown, depth = 0): unknown {
    if (!cause || depth >= 3) return undefined;

    if (cause instanceof Error) {
      return {
        name: cause.name,
        message: cause.message,
        stack: cause.stack,
        cause: this.serializeCause((cause as ApplicationError).cause, depth + 1)
      };
    }

    return cause;
  }

  serialize() {
    const serialized = {
      status: this.status,
      statusCode: this.statusCode,
      reasonPhrase: this.reasonPhrase,
      message: this.message,
      stack: this.stack,
      errorCode: this.errorCode,
      operation: this.operation,
      context: this.context,
      error: this.error,
      cause: this.serializeCause(this.cause),
    };
    return serialized;
  }

  serializeForClient() {
    return {
      message: this.clientMessage ?? 'An unexpected error occurred.',
      statusCode: this.statusCode,
      errorCode: this.errorCode,
      reasonPhrase: this.reasonPhrase,
      error: this.error
    };
  }
}
