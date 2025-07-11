import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { CustomError, NotAuthorizedError, ServerError } from './error-handler';
import { Logger } from './logger';

const tokens: string[] = ['auth', 'seller', 'gig', 'search', 'buyer', 'message', 'order', 'review'];

export const verifyGatewayRequest = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.headers?.gatewaytoken) {
    throw new NotAuthorizedError(
      'Invalid request',
      'verifyGatewayRequest() method: Request not coming from api gateway'
    );
  }

  const token: string = req.headers?.gatewaytoken as string;
  if (!token) {
    throw new NotAuthorizedError(
      'Invalid request',
      'verifyGatewayRequest() method: Request not coming from api gateway'
    );
  }

  try {
    const payload: { id: string; iat: number } = JWT.verify(token, 'CWasd/wO1e5zVzwN0y5Va4rmiFsayZg4J81714GnrTw=') as {
      id: string;
      iat: number;
    };

    if (!tokens.includes(payload.id)) {
      throw new NotAuthorizedError(
        'Invalid request',
        'verifyGatewayRequest() method: Request payload is invalid'
      );
    }
  } catch (error) {
    throw new NotAuthorizedError(
      'Invalid request',
      'verifyGatewayRequest() method: Request not coming from api gateway'
    );
  }
  next();
};

export const errorHandler = (logger: Logger) => {
  return (error: any, _req: Request, res: Response, _next: NextFunction) => {
    if (error instanceof CustomError) {
      logger.error(error);
      res.status(error.statusCode).json(error.serialize());
      return;
    }

    const serverError = error instanceof Error
      ? new ServerError(error.message, logger.getServiceName(), 'INTERNAL_SERVER_ERROR')
      : new ServerError('An unexpected error occurred', logger.getServiceName(), 'INTERNAL_SERVER_ERROR');

    logger.error(serverError, error instanceof Error ? { stack: error.stack } : undefined);
    res.status(serverError.statusCode).json(serverError.serialize());
    return;
  };
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) =>
  Promise.resolve(fn(req, res, next)).catch(next);
