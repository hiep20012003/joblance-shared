import { MessageQueueType } from "../../core";

export interface IRoleDocument{
  name: string;
  description?: string;
}

export interface IAuthDocument {
  id?: string,
  username?: string;
  email?:string;
  is_verified?: boolean;
  status?: string,
  roles? : string[]
}

export interface IAuth {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface IAuthMessage {
  to?: string;
  type?: MessageQueueType;
  username?: string;
  resetLink?: string;
  verificationLink?: string;
}
