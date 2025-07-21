export interface Jwk {
  kid: string;
  alg: string;
  kty: string;
  use: string;
  pem: string;
}

export interface JwksResponse {
  message: string;
  statusCode: number;
  reasonPhrase: string;
  metadata: {
    keys: Jwk[];
  };
}

export interface JwtConfig {
  URL: string;
  JWT_ALGORITHM: string;
}
