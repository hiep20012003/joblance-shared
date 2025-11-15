import { JwtPayload } from "./auth";
import Multer from 'multer';
import {Socket} from 'socket.io';

export {};

declare global {
  namespace Express {
    interface Request {
      audience: string;
      currentUser?: JwtPayload;
      validatedQuery?: any;
      traceContext?: Record<string, unknown>;
      file?: Express.Multer.File;
      rawBody?: any;
      durationMs?: number;
      operation?: string;
    }
  }
}

export interface SocketWithUser extends Socket {
  data: {
    user?: JwtPayload;
  };
}
