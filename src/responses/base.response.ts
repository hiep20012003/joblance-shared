
export interface ResponseOptions<M=unknown, E=unknown> {
  message: string;
  statusCode: number;
  reasonPhrase: string;
  metadata?: M;
  error?: E;
}

export abstract class ApplicationResponse {
  message: string;
  statusCode: number;
  reasonPhrase: string;
  metadata: unknown;
  error: unknown;

  constructor({ message, statusCode, reasonPhrase, metadata, error }: ResponseOptions) {
    this.message = message;
    this.statusCode = statusCode;
    this.reasonPhrase = reasonPhrase;
    this.metadata = metadata;
    this.error = error;
  }
}


