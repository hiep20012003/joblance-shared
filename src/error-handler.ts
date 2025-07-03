import { StatusCodes } from 'http-status-codes';

export interface IError {
  message: string;
  statusCode: number;
  status: 'error' | 'fail';
  comingFrom: string;
  stack?: string;
  errorCode?: string; // Optional error code for easier log searching
}

export abstract class CustomError extends Error {
  abstract statusCode: number;
  abstract status: 'error' | 'fail';
  comingFrom: string;
  errorCode?: string;

  /**
   * @param message - Error message
   * @param comingFrom - Origin of the error (e.g. module or service name)
   * @param errorCode - Optional error code for tracking
   */
  constructor(message: string = 'An error occurred', comingFrom: string = 'Unknown', errorCode?: string) {
    super(message);
    this.comingFrom = comingFrom;
    this.errorCode = errorCode;
    Object.setPrototypeOf(this, new.target.prototype);
  }

  /**
   * Serialize error details for logging or API responses
   */
  serialize(): IError {
    return {
      message: this.message,
      statusCode: this.statusCode,
      status: this.status,
      comingFrom: this.comingFrom,
      stack: this.stack,
      errorCode: this.errorCode,
    };
  }
}

// -------- Client errors (4xx) --------

export class BadRequestError extends CustomError {
  statusCode = StatusCodes.BAD_REQUEST;
  status: 'fail' = 'fail';

  constructor(
    message: string = 'Bad request',
    comingFrom: string = 'Unknown',
    errorCode?: string
  ) {
    super(message, comingFrom, errorCode);
  }
}

export class ValidationError extends CustomError {
  statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  status: 'fail' = 'fail';

  constructor(
    message: string = 'Validation failed',
    comingFrom: string = 'Unknown',
    errorCode = 'VALIDATION_ERROR'
  ) {
    super(message, comingFrom, errorCode);
  }
}

export class ConflictError extends CustomError {
  statusCode = StatusCodes.CONFLICT;
  status: 'fail' = 'fail';

  constructor(
    message: string = 'Resource conflict',
    comingFrom: string = 'Unknown',
    errorCode = 'RESOURCE_CONFLICT'
  ) {
    super(message, comingFrom, errorCode);
  }
}

export class TooManyRequestsError extends CustomError {
  statusCode = StatusCodes.TOO_MANY_REQUESTS;
  status: 'fail' = 'fail';

  constructor(
    message: string = 'Too many requests',
    comingFrom: string = 'Unknown',
    errorCode = 'TOO_MANY_REQUESTS'
  ) {
    super(message, comingFrom, errorCode);
  }
}

export class NotFoundError extends CustomError {
  statusCode = StatusCodes.NOT_FOUND;
  status: 'fail' = 'fail';

  constructor(
    message: string = 'Resource not found',
    comingFrom: string = 'Unknown',
    errorCode?: string
  ) {
    super(message, comingFrom, errorCode);
  }
}

export class ForbiddenError extends CustomError {
  statusCode = StatusCodes.FORBIDDEN;
  status: 'fail' = 'fail';

  constructor(
    message: string = 'Access forbidden',
    comingFrom: string = 'Unknown',
    errorCode?: string
  ) {
    super(message, comingFrom, errorCode);
  }
}

export class NotAuthorizedError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED;
  status: 'fail' = 'fail';

  constructor(
    message: string = 'Unauthorized access',
    comingFrom: string = 'Unknown',
    errorCode?: string
  ) {
    super(message, comingFrom, errorCode);
  }
}

export class UnauthorizedTokenError extends CustomError {
  statusCode = StatusCodes.UNAUTHORIZED;
  status: 'fail' = 'fail';

  constructor(
    message: string = 'Invalid or expired token',
    comingFrom: string = 'AuthMiddleware',
    errorCode = 'TOKEN_INVALID'
  ) {
    super(message, comingFrom, errorCode);
  }
}

export class FileTooLargeError extends CustomError {
  statusCode = StatusCodes.REQUEST_TOO_LONG;
  status: 'fail' = 'fail';

  constructor(
    message: string = 'File size too large',
    comingFrom: string = 'Unknown',
    errorCode?: string
  ) {
    super(message, comingFrom, errorCode);
  }
}

// -------- Server errors (5xx) --------

export class ServerError extends CustomError {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  status: 'error' = 'error';

  constructor(
    message: string = 'Internal server error',
    comingFrom: string = 'Unknown',
    errorCode?: string
  ) {
    super(message, comingFrom, errorCode);
  }
}

export class DependencyError extends CustomError {
  statusCode = StatusCodes.SERVICE_UNAVAILABLE;
  status: 'error' = 'error';

  constructor(
    message: string = 'External dependency unavailable',
    comingFrom: string = 'Unknown',
    errorCode = 'DEPENDENCY_UNAVAILABLE'
  ) {
    super(message, comingFrom, errorCode);
  }
}

export class DatabaseError extends CustomError {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  status: 'error' = 'error';

  constructor(
    message: string = 'Database operation failed',
    comingFrom: string = 'DatabaseService',
    errorCode = 'DB_ERROR'
  ) {
    super(message, comingFrom, errorCode);
  }
}
