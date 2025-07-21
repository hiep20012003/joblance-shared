import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

import { UnauthorizedError } from '../../core';
import { CacheClient } from '../../redis';
import { JwtConfig } from '../../common';
import { getPublicKeysFromJwks, verifyJwtToken } from '../../common/utils';


export const createAuthMiddleware = (config: JwtConfig, cache: CacheClient) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const operation = 'middleware:auth';

    try {
      if (!req.headers.authorization) {
        return next(new UnauthorizedError({
          clientMessage: 'Not authorized to access this route. No token provided.',
          operation
        }));
      }

      const token = req.headers.authorization.split(' ')[1];
      if (!token) {
        return next(new UnauthorizedError({
          clientMessage: 'Not authorized to access this route. Token is missing.',
          operation
        }));
      }

      const decoded = jwt.decode(token, { complete: true });
      if (!decoded || !decoded.header.kid) {
        return next(new UnauthorizedError({
          clientMessage: 'Invalid JWT: missing kid',
          operation: 'middleware:auth-invalid-token',
        }));
      }

      const kid = decoded.header.kid;
      const alg = decoded.header.alg as jwt.Algorithm;

      // Đảm bảo await nếu verifyJwtToken là async
      const publicKeys = await getPublicKeysFromJwks(config, cache, kid);
      const payload = verifyJwtToken(token, alg, publicKeys);

      req.currentUser = payload;
      return next();
    } catch (error) {
      return next(new UnauthorizedError({
        clientMessage: 'Not authorized to access this route. Invalid token.',
        operation: 'middleware:auth-invalid-token',
        cause: error
      }));
    }
  };
};

