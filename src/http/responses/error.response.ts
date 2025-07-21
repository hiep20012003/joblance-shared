import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { ApplicationResponse, ResponseOptions } from './base.response';

export class ErrorResponse extends ApplicationResponse {
  constructor({ message, statusCode = StatusCodes.INTERNAL_SERVER_ERROR, reasonPhrase = ReasonPhrases.INTERNAL_SERVER_ERROR, error }: ResponseOptions) {
    super({ message, statusCode, reasonPhrase, error });
  }
  send = (res: Response): void => {
    res.status(this.statusCode).json({
      message: this.message,
      statusCode: this.statusCode,
      reasonPhrase: this.reasonPhrase,
      error: this.error,
    });
  };
}
