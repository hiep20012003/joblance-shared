import { EmailTemplate } from '../../integrations/email/email';

export type IEmailTemplateContext =
  | IVerifyEmailTemplateContext
  | IResetPasswordTemplateContext
  | IWelcomeEmailTemplateContext;

export interface IEmailPayload {
  to: string;
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

export interface IWelcomeEmailTemplateContext extends IBaseTemplateContext {
  username: string;
}
