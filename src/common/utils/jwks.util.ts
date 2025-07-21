import axios, { AxiosResponse } from 'axios';

import { JwksResponse, JwtConfig } from '../types';
import { CacheClient } from '../../redis';
import { ServerError } from '../../core';


const JWKS_CACHE_KEY = 'jwks_public_keys';
const JWKS_CACHE_TTL = 60 * 10; // 10 minutes

export const getPublicKeysFromJwks = async (
  config: JwtConfig,
  cache: CacheClient,
  kid?: string
): Promise<Map<string, string>> => {
  let publicKeys: Map<string, string>;

  try {
    publicKeys = await cache.getMap(JWKS_CACHE_KEY);
    if (publicKeys) {
      if (!kid || publicKeys.has(kid)) {
        return publicKeys;
      }
    }
  } catch (cacheError) {
    throw new ServerError({
      clientMessage: 'Redis cache read error',
      operation: 'middleware:cache-read-error',
      cause: cacheError
    });
  }

  // Fetch lại từ JWKS
  const response: AxiosResponse<JwksResponse> = await axios.get(config.URL);
  const keys = response.data.metadata.keys;
  publicKeys = new Map();
  for (const key of keys) {
    publicKeys.set(key.kid, key.pem);
  }

  await cache.setMap(JWKS_CACHE_KEY, JWKS_CACHE_TTL, publicKeys);
  return publicKeys;
};

