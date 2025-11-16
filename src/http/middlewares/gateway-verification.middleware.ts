import jwt, {TokenExpiredError} from 'jsonwebtoken';
import {Request, Response, NextFunction} from 'express';

import {ErrorCode, JwtPayload} from '../../common';
import {UnauthorizedError} from '../../core';

const ALLOWED_SERVICES = ['auth', 'sellers', 'gigs', 'search', 'buyers', 'chats', 'orders', 'reviews', 'users', 'notifications'];

export const createVerifyGatewayRequest = (gatewaySecretOrPublicKey: string) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const gatewayTokenHeader = req.headers['x-internal-token'];
    if (!gatewayTokenHeader || typeof gatewayTokenHeader !== 'string') {
      throw new UnauthorizedError({
        clientMessage: 'Invalid request',
        logMessage: 'Missing X-Internal-Token header',
        operation: 'middleware:verify-gateway-request'
      });
    }

    try {
      const payload = jwt.verify(gatewayTokenHeader, gatewaySecretOrPublicKey) as JwtPayload;

      if (!ALLOWED_SERVICES.includes(payload.aud)) {
        throw new UnauthorizedError({
          clientMessage: 'Invalid request',
          logMessage: `Service ID ${payload.aud} not allowed`,
          operation: 'middleware:verify-gateway-request'
        });
      }

      req.currentUser = payload;
    } catch (error) {
      if (error instanceof TokenExpiredError)
        throw new UnauthorizedError({
          clientMessage: 'Token Expired',
          logMessage: 'X-Gateway-Token Expired',
          operation: 'middleware:verify-gateway-request',
          errorCode: ErrorCode.TOKEN_EXPIRED
        });

      throw new UnauthorizedError({
        clientMessage: 'Invalid request',
        logMessage: `${(error as Error).message}`,
        operation: 'middleware:verify-gateway-request'
      });
    }

    next();
  };
};
