declare global {
  namespace Express {
    interface Request {
      currentUser?: IAuthPayload;
    }
  }
}

export interface IAuth {
  username?: string;
  password?: string;
  email?: string;
  country?: string;
  profilePicture?: string;
}

export interface IAuthEmailMessageDetails {
  receiverEmail?: string;
  template?: string;
  verifyLink?: string;
  resetLink?: string;
  opt?: string;
  username?: string;
}

export interface IAuthPayload {
  id: number;
  username: string;
  email: string;
  iat?: number;
}

export interface IAuthDocument {
  id?: number;
  profilePublicId?: string;
  username?: string;
  email?: string;
  password?: string;
  country?: string;
  profilePicture?: string;
  emailVerified?: boolean;
  emailVerificationToken?: string;
  createAt?: string;
  updateAt?: string;
  passwordResetToken?: string;
  passwordResetExpires?: string;
  otp?: string;
  otpExpiration?: Date;
  browserName?: string;
  deviceType?: string;
  comparePassword(password: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}
export interface IAuthBuyerMessageDetails {
  username?: string;
  email?: string;
  country?: string;
  profilePicture?: string;
  createAt?: string;
  type?: string;
}
export interface IRefreshTokenDocument {
  userId?: number;
  deviceId?: string;
  refreshToken?: string;
  expiresAt?: Date;
  userAgent?: string;
  ipAddress?: string;
  revoked?: string;
}
