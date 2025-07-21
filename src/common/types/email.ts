import { EmailTemplate } from '../../integrations/email/email';

export type EmailTemplateContext =
  | VerifyEmailTemplateContext
  | ResetPasswordTemplateContext
  | WelcomeEmailTemplateContext;

export interface IEmailMessage {
  to: string,
  template: EmailTemplate
}

export interface AuthEmailMessage extends IEmailMessage {
  username: string,
  verificationLink?: string,
  resetLink?: string,
}

export interface EmailPayload {
  to: string;
  subject: string;
  template: EmailTemplate;
  context: EmailTemplateContext;
}

export interface BaseTemplateContext {
  appLink: string,
  appIcon: string
}

export interface VerifyEmailTemplateContext extends BaseTemplateContext {
  username: string;
  verificationLink: string;
}

export interface ResetPasswordTemplateContext extends BaseTemplateContext {
  username: string;
  resetLink: string;
}

export interface WelcomeEmailTemplateContext extends BaseTemplateContext {
  username: string;
}
