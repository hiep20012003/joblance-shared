import jwt from 'jsonwebtoken';

import { UnauthorizedError } from '../../core';


export const verifyJwtToken = (
  token: string,
  algorithm: string,
  publicKeys: Map<string, string>
): Record<string, unknown> => {
  const decoded = jwt.decode(token, { complete: true }) as { header: { kid: string } };
  const kid = decoded?.header?.kid;

  if (!kid || !publicKeys.has(kid)) {
    throw new UnauthorizedError({
      clientMessage: 'Invalid token key id.',
      operation: 'auth:verify-jwt'
    });
  }

  const publicKey = publicKeys.get(kid) as string;
  return jwt.verify(token, publicKey, { algorithms: [algorithm as jwt.Algorithm] }) as Record<string, unknown>;
};
