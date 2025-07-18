import JWT from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { UnauthorizedError } from '../errors';

const tokens: string[] = ['auth', 'seller', 'gig', 'search', 'buyer', 'message', 'order', 'review'];

export const verifyGatewayRequest = (req: Request, res: Response, next: NextFunction): void => {
  if (!req.headers?.gatewaytoken) {
    throw new UnauthorizedError({
      clientMessage: 'Invalid request',
      logMessage: 'Request not coming from api gateway',
    });
  }

  const token: string = req.headers?.gatewaytoken as string;
  if (!token) {
    throw new UnauthorizedError({
      clientMessage: 'Invalid request',
      logMessage: 'Request not coming from api gateway',
    });
  }

  try {
    const payload: { id: string; iat: number } = JWT.verify(
      token,
      'CWasd/wO1e5zVzwN0y5Va4rmiFsayZg4J81714GnrTw='
    ) as { id: string; iat: number };

    if (!tokens.includes(payload.id)) {
      throw new UnauthorizedError({
        clientMessage: 'Invalid request',
        logMessage: 'Request payload is invalid',
      });
    }
  } catch {
    throw new UnauthorizedError({
      clientMessage: 'Invalid request',
      logMessage: 'Request not coming from api gateway',
    });
  }

  next();
};
