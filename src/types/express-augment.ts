import { Request } from 'express';
export {};
declare global {
  namespace Express {
    interface Request {
      user?: Record<string, unknown>
      traceContext?: Record<string, unknown>;
      error?: Record<string, unknown>;
    }
  }
}
