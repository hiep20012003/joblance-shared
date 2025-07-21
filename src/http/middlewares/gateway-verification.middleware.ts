import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { UnauthorizedError } from '../../core';


const ALLOWED_SERVICES = ['auth', 'seller', 'gig', 'search', 'buyer', 'message', 'order', 'review'];

export const createVerifyGatewayRequest = (gatewaySecretOrPublicKey: string) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const gatewayTokenHeader = req.headers['x-gateway-token'];
    if (!gatewayTokenHeader || typeof gatewayTokenHeader !== 'string') {
      throw new UnauthorizedError({
        clientMessage: 'Invalid request',
        logMessage: 'Missing X-Gateway-Token header',
        operation: 'middleware:verify-gateway-request'
      });
    }

    try {
      const payload = JWT.verify(gatewayTokenHeader, gatewaySecretOrPublicKey) as { id: string; iat: number };

      if (!ALLOWED_SERVICES.includes(payload.id)) {
        throw new UnauthorizedError({
          clientMessage: 'Invalid request',
          logMessage: `Service ID ${payload.id} not allowed`,
          operation: 'middleware:verify-gateway-request'
        });
      }
    } catch {
      throw new UnauthorizedError({
        clientMessage: 'Invalid request',
        logMessage: 'X-Gateway-Token is invalid',
        operation: 'middleware:verify-gateway-request'
      });
    }

    next();
  };
};
