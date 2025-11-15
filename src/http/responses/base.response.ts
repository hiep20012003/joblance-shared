export interface ResponseOptions<M = unknown, E = unknown> {
  message?: string;
  statusCode: number;
  errorCode?: string;
  reasonPhrase?: string;
  error?: E;
  data?: M;
}

export abstract class ApplicationResponse {
  message: string | undefined;
  statusCode: number;
  errorCode: string | undefined;
  reasonPhrase: string | undefined;
  error: unknown;
  data: unknown;

  protected constructor({message, statusCode, errorCode, reasonPhrase, data, error}: ResponseOptions) {
    this.message = message;
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.reasonPhrase = reasonPhrase;
    this.data = data;
    this.error = error;
  }
}


