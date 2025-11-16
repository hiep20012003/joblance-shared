import {EmailTemplate} from '../constants/constants';

export type IEmailTemplateContext =
  | IVerifyEmailTemplateContext
  | IResetPasswordTemplateContext
  | IOrderEmailContext

export interface IEmailPayload {
  to: string;
  messageId: string;
  subject: string;
  template: EmailTemplate;
  context: IEmailTemplateContext;
}

export interface IBaseTemplateContext {
  appLink: string,
  appIcon: string
}

export interface IVerifyEmailTemplateContext extends IBaseTemplateContext {
  username: string;
  verificationLink: string;
}

export interface IResetPasswordTemplateContext extends IBaseTemplateContext {
  username: string;
  resetLink: string;
}

export interface IOrderEmailContext extends IBaseTemplateContext {
  orderId?: string;
  sellerUsername?: string;
  buyerUsername?: string;
  title?: string;
  description?: string;
  expectedDeliveryDate?: string;
  originalDate?: string;
  newDate?: string;
  expectedDeliveryDays?: number;
  reason?: string;
  quantity?: number;
  price?: number;
  serviceFee?: number;
  totalAmount?: number;
  orderUrl?: string;
}
