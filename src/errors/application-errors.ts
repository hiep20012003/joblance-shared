import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { ApplicationError, ErrorOptions, ErrorCode } from './base-error';

export class BadRequestError extends ApplicationError {
  statusCode = StatusCodes.BAD_REQUEST;
  reasonPhrase = ReasonPhrases.BAD_REQUEST;

  status = 'fail' as const;
  constructor(options?: Partial<ErrorOptions>) {
    super({
      clientMessage: options?.clientMessage ?? 'Bad request',
      logMessage: options?.logMessage,
      errorCode: options?.errorCode ?? ErrorCode.BAD_REQUEST,
      operation: options?.operation ?? 'http-bad-request',
      context: options?.context,
      cause: options?.cause,
    });
  }
}

export class ValidationError extends ApplicationError {
  statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  reasonPhrase = ReasonPhrases.UNPROCESSABLE_ENTITY;

  status = 'fail' as const;
  constructor(options?: Partial<ErrorOptions>) {
    super({
      clientMessage: options?.clientMessage ?? 'Validation failed',
      logMessage: options?.logMessage,
      errorCode: options?.errorCode ?? ErrorCode.VALIDATION_ERROR,
      operation: options?.operation ?? 'validation-error',
      context: options?.context,
      cause: options?.cause,
    });
  }
}

export class ConflictError extends ApplicationError {
  statusCode = StatusCodes.CONFLICT;
  reasonPhrase = ReasonPhrases.CONFLICT;

  status = 'fail' as const;
  constructor(options?: Partial<ErrorOptions>) {
    super({
      clientMessage: options?.clientMessage ?? 'Resource conflict',
      logMessage: options?.logMessage,
      errorCode: options?.errorCode ?? ErrorCode.RESOURCE_CONFLICT,
      operation: options?.operation ?? 'resource-conflict',
      context: options?.context,
      cause: options?.cause,
    });
  }
}

export class TooManyRequestsError extends ApplicationError {
  statusCode = StatusCodes.TOO_MANY_REQUESTS;
  reasonPhrase = ReasonPhrases.TOO_MANY_REQUESTS;

  status = 'fail' as const;
  constructor(options?: Partial<ErrorOptions>) {
    super({
      clientMessage: options?.clientMessage ?? 'Too many requests',
      logMessage: options?.logMessage,
      errorCode: options?.errorCode ?? ErrorCode.TOO_MANY_REQUESTS,
      operation: options?.operation ?? 'too-many-requests',
      context: options?.context,
      cause: options?.cause,
    });
  }
}

export class NotFoundError extends ApplicationError {
  statusCode = StatusCodes.NOT_FOUND;
  reasonPhrase = ReasonPhrases.NOT_FOUND;

  status = 'fail' as const;
  constructor(options?: Partial<ErrorOptions>) {
    super({
      clientMessage: options?.clientMessage ?? 'Resource not found',
      logMessage: options?.logMessage,
      errorCode: options?.errorCode ?? ErrorCode.NOT_FOUND,
      operation: options?.operation ?? 'resource-not-found',
      context: options?.context,
      cause: options?.cause,
    });
  }
}

export class ForbiddenError extends ApplicationError {
  statusCode = StatusCodes.FORBIDDEN;
  reasonPhrase = ReasonPhrases.FORBIDDEN;

  status = 'fail' as const;
  constructor(options?: Partial<ErrorOptions>) {
    super({
      clientMessage: options?.clientMessage ?? 'Access forbidden',
      logMessage: options?.logMessage,
      errorCode: options?.errorCode ?? ErrorCode.FORBIDDEN,
      operation: options?.operation ?? 'access-forbidden',
      context: options?.context,
      cause: options?.cause,
    });
  }
}

export class UnauthorizedError extends ApplicationError {
  statusCode = StatusCodes.UNAUTHORIZED;
  reasonPhrase = ReasonPhrases.UNAUTHORIZED;

  status = 'fail' as const;
  constructor(options?: Partial<ErrorOptions>) {
    super({
      clientMessage: options?.clientMessage ?? 'Unauthorized',
      logMessage: options?.logMessage,
      errorCode: options?.errorCode ?? ErrorCode.UNAUTHORIZED,
      operation: options?.operation ?? 'unauthorized',
      context: options?.context,
      cause: options?.cause,
    });
  }
}

export class AuthenticationFailedError extends ApplicationError {
  statusCode = StatusCodes.UNAUTHORIZED;
  reasonPhrase = ReasonPhrases.UNAUTHORIZED;
  status = 'fail' as const;
  constructor(options?: Partial<ErrorOptions>) {
    super({
      clientMessage: options?.clientMessage ?? 'Authentication failed',
      logMessage: options?.logMessage,
      errorCode: options?.errorCode ?? ErrorCode.AUTHENTICATION_FAILED,
      operation: options?.operation ?? 'authentication-failed',
      context: options?.context,
      cause: options?.cause,
    });
  }
}


export class TimeoutError extends ApplicationError {
  statusCode = StatusCodes.REQUEST_TIMEOUT;
  reasonPhrase = ReasonPhrases.REQUEST_TIMEOUT;

  status = 'fail' as const;
  constructor(options?: Partial<ErrorOptions>) {
    super({
      clientMessage: options?.clientMessage ?? 'Request timeout',
      logMessage: options?.logMessage,
      errorCode: options?.errorCode ?? ErrorCode.TIMEOUT,
      operation: options?.operation ?? 'request-timeout',
      context: options?.context,
      cause: options?.cause,
    });
  }
}

export class NotImplementedError extends ApplicationError {
  statusCode = StatusCodes.NOT_IMPLEMENTED;
  reasonPhrase = ReasonPhrases.NOT_IMPLEMENTED;

  status = 'error' as const;
  constructor(options?: Partial<ErrorOptions>) {
    super({
      clientMessage: options?.clientMessage ?? 'Not implemented',
      logMessage: options?.logMessage,
      errorCode: options?.errorCode ?? ErrorCode.NOT_IMPLEMENTED,
      operation: options?.operation ?? 'not-implemented',
      context: options?.context,
      cause: options?.cause,
    });
  }
}

export class ServerError extends ApplicationError {
  statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  reasonPhrase = ReasonPhrases.INTERNAL_SERVER_ERROR;

  status = 'error' as const;
  constructor(options?: Partial<ErrorOptions>) {
    super({
      clientMessage: options?.clientMessage ?? 'Internal server error',
      logMessage: options?.logMessage,
      errorCode: options?.errorCode ?? ErrorCode.INTERNAL_SERVER_ERROR,
      operation: options?.operation ?? 'internal-server-error',
      context: options?.context,
      cause: options?.cause,
    });
  }
}

export class DependencyError extends ApplicationError {
  statusCode = StatusCodes.SERVICE_UNAVAILABLE;
  reasonPhrase = ReasonPhrases.SERVICE_UNAVAILABLE;

  status = 'error' as const;
  constructor(options?: Partial<ErrorOptions>) {
    super({
      clientMessage: options?.clientMessage ?? 'Dependency unavailable',
      logMessage: options?.logMessage,
      errorCode: options?.errorCode ?? ErrorCode.DEPENDENCY_UNAVAILABLE,
      operation: options?.operation ?? 'dependency-unavailable',
      context: options?.context,
      cause: options?.cause,
    });
  }
}

export class FileTooLargeError extends ApplicationError {
  statusCode = StatusCodes.REQUEST_TOO_LONG;
  reasonPhrase = ReasonPhrases.REQUEST_TOO_LONG;

  status = 'fail' as const;
  constructor(options?: Partial<ErrorOptions>) {
    super({
      clientMessage: options?.clientMessage ?? 'File size too large',
      logMessage: options?.logMessage,
      errorCode: options?.errorCode ?? ErrorCode.FILE_TOO_LARGE,
      operation: options?.operation ?? 'file-too-large',
      context: options?.context,
      cause: options?.cause,
    });
  }
}

export class UnsupportedMediaTypeError extends ApplicationError {
  statusCode = StatusCodes.UNSUPPORTED_MEDIA_TYPE;
  reasonPhrase = ReasonPhrases.UNSUPPORTED_MEDIA_TYPE;

  status = 'fail' as const;
  constructor(options?: Partial<ErrorOptions>) {
    super({
      clientMessage: options?.clientMessage ?? 'Unsupported media type',
      logMessage: options?.logMessage,
      errorCode: options?.errorCode ?? ErrorCode.UNSUPPORTED_MEDIA_TYPE,
      operation: options?.operation ?? 'unsupported-media-type',
      context: options?.context,
      cause: options?.cause,
    });
  }
}

export class UnprocessableEntityError extends ApplicationError {
  statusCode = StatusCodes.UNPROCESSABLE_ENTITY;
  reasonPhrase = ReasonPhrases.UNPROCESSABLE_ENTITY;

  status = 'fail' as const;
  constructor(options?: Partial<ErrorOptions>) {
    super({
      clientMessage: options?.clientMessage ?? 'Unprocessable entity',
      logMessage: options?.logMessage,
      errorCode: options?.errorCode ?? ErrorCode.UNPROCESSABLE_ENTITY,
      operation: options?.operation ?? 'unprocessable-entity',
      context: options?.context,
      cause: options?.cause,
    });
  }
}
