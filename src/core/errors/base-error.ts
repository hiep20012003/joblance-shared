export enum ErrorCode {
  BAD_REQUEST = 'BAD_REQUEST',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  RESOURCE_CONFLICT = 'RESOURCE_CONFLICT',
  TOO_MANY_REQUESTS = 'TOO_MANY_REQUESTS',
  NOT_FOUND = 'NOT_FOUND',
  FORBIDDEN = 'FORBIDDEN',
  UNAUTHORIZED = 'UNAUTHORIZED',
  AUTHENTICATION_FAILED = 'AUTHENTICATION_FAILED',
  FILE_TOO_LARGE = 'FILE_TOO_LARGE',
  UNSUPPORTED_MEDIA_TYPE = 'UNSUPPORTED_MEDIA_TYPE',
  TIMEOUT = 'TIMEOUT',
  INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  DEPENDENCY_UNAVAILABLE = 'DEPENDENCY_UNAVAILABLE',
  DEPENDENCY_ERROR = 'DEPENDENCY_ERROR',
  NOT_IMPLEMENTED = 'NOT_IMPLEMENTED',
  UNPROCESSABLE_ENTITY = 'UNPROCESSABLE_ENTITY',
  EMAIL_NOT_VERIFIED = 'EMAIL_NOT_VERIFIED',
  TOKEN_INVALID = 'TOKEN_INVALID',
  TOKEN_EXPIRED = 'TOKEN_EXPIRED',
}

export interface ErrorOptions {
  clientMessage?: string;
  logMessage?: string;
  errorCode?: ErrorCode;
  statusCode?: number;
  reasonPhrase?: string;
  operation?: string
  cause?: unknown;
  context?: unknown;
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

  constructor(options: ErrorOptions) {
    super(options.logMessage ?? options.clientMessage);
    this.name = new.target.name;
    this.clientMessage = options.clientMessage;
    this.errorCode = options.errorCode;
    this.operation = options.operation ?? 'unknown';
    this.cause = options.cause;
    this.context = options.context;
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
    };
  }
}
