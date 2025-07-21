import { Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';

import { ApplicationResponse, ResponseOptions } from './base.response';

export class SuccessResponse extends ApplicationResponse {
  constructor({ message, statusCode = StatusCodes.OK, reasonPhrase = ReasonPhrases.OK, metadata }: ResponseOptions) {
    super({ message, statusCode, reasonPhrase, metadata });
  }
  send = (res: Response): void => {
    res.status(this.statusCode).json({
      message: this.message,
      statusCode: this.statusCode,
      reasonPhrase: this.reasonPhrase,
      metadata: this.metadata,
    });
  };
}
