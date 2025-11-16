import {Response} from 'express';
import {ReasonPhrases, StatusCodes} from 'http-status-codes';

import {ApplicationResponse, ResponseOptions} from './base.response';

export class SuccessResponse extends ApplicationResponse {
  constructor({message, statusCode = StatusCodes.OK, reasonPhrase = ReasonPhrases.OK, data}: ResponseOptions) {
    super({message, statusCode, reasonPhrase, data});
  }

  send = (res: Response): void => {
    if (this.data || this.message)
      res.status(this.statusCode).json(this.data ?? this.message);
    else
      res.status(this.statusCode).send()
  };
}
