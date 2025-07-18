export interface IUser {
  id: string;
  username: string;
  email: string;
  password_hash: string;
  is_verified: boolean;
  profile?: IUserProfile;
  roles?: IRole[];
  refreshTokens?: IRefreshToken[];
  emailVerificationTokens?: IEmailVerificationToken[];
  passwordResetTokens?: IPasswordResetToken[];
}

export interface IUserResponse {
  id: string;
  username: string;
  email: string;
  is_verified: boolean;
  profile?: IUserProfile;
  roles?: IRoleResponse[];
}

export interface IUserProfile {
  id: string;
  user_id: string;
  full_name?: string;
  avatar?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  dob?: Date;
}

export interface IUserProfileInput {
  full_name?: string;
  avatar?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  dob?: Date;
}

// Role related interfaces
export interface IRole {
  id: string;
  name: string;
  description?: string;
}

export interface IRoleResponse {
  id: string;
  name: string;
}

export interface IUserRole {
  id: string;
  user_id: string;
  role_id: string;
}

// Authentication requests
export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
  profile: IUserProfile
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface RequestEmailVerification {
  email: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  new_password: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

// Authentication response
export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  user: IUserResponse;
}

// Token related interfaces
export interface IRefreshToken {
  id: string;
  user_id: string;
  token: string;
  user_agent?: string;
  ip_address?: string;
  expires_at: Date;
  revoked: boolean;
}

export interface IEmailVerificationToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  used: boolean;
}

export interface IPasswordResetToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: Date;
  used: boolean;
}
