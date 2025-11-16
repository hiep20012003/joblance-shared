import {ApplicationError} from '../../core/errors/base-error';
import {Response} from 'express';
import {ReasonPhrases, StatusCodes} from 'http-status-codes';

import {ApplicationResponse, ResponseOptions} from './base.response';

export class ErrorResponse extends ApplicationResponse {

  constructor({
                message,
                statusCode = StatusCodes.INTERNAL_SERVER_ERROR,
                errorCode,
                reasonPhrase = ReasonPhrases.INTERNAL_SERVER_ERROR,
                error
              }: ResponseOptions) {
    super({message, statusCode, errorCode, reasonPhrase, error});
  }

  send = (res: Response, toGateway = false): void => {
    if (toGateway) {
      res.status(this.statusCode).json({
        message: this.message,
        statusCode: this.statusCode,
        reasonPhrase: this.reasonPhrase,
        errorCode: this.errorCode,
        error: this.error,
      });
      return;
    }

    res.status(this.statusCode).json({
      message: this.message,
      statusCode: this.statusCode,
      reasonPhrase: this.reasonPhrase,
      error: this.error,
    })
  };
}
