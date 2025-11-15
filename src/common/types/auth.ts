import {MessageQueueType} from '../constants/constants';

export interface IRoleDocument {
  name: string;
  description?: string;
}

export interface IAuthDocument {
  id?: string,
  username?: string;
  email?: string;
  profilePicture?: string;
  isVerified?: boolean;
  status?: string;
  roles?: string[];

  [key: string]: any;
}

export interface IAuth {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface IAuthMessageQueue {
  type?: MessageQueueType;
  messageId?: string;
  userId?: string
  email?: string;
  username?: string;
  country?: string;
  sex?: string;
  resetLink?: string;
  verificationLink?: string;
}

export interface IUserAgent {
  browserName?: string;
  deviceType?: string;
  ipAddress?: string;
}

export interface IVaultSignResponse {
  data: {
    signature: string;
    key_version: number;
  };
}

export interface IVaultKeyDataResponse {
  data: {
    name: string;
    type: string;
    latest_version: number;
    keys: Record<
      string,
      {
        public_key: string;
      }
    >;
  }
}

export interface JwtPayload {
  iss?: string;
  aud: string;
  sub: string;
  email?: string;
  username?: string;
  roles?: string[];
  jti?: string;
  iat?: number;
  exp?: number;

  [key: string]: any;
}


export interface IGrantsObject {
  [roleName: string]: {
    [resourceName: string]: {
      [action: string]: string[];
    };
  };
};
