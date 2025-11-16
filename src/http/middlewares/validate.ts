import {NextFunction, Response, Request} from 'express';
import {ZodType, z, file} from 'zod';
import {BadRequestError} from '../../core';

export const validate = (schema: any) => (req: Request, _res: Response, next: NextFunction) => {
  const result = schema.safeParse(req.body);
  console.log(req.body);

  if (!result.success) {
    const flattened = z.flattenError(result.error);

    throw new BadRequestError({
      clientMessage: 'Validation error',
      operation: 'middleware:validate-body',
      error: flattened,
      context: {...flattened},
    });
  }

  req.body = result.data;
  next();
};

export const validateQueryMiddleware =
  (schema: any) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.query);

    if (!result.success) {
      const flattened = z.flattenError(result.error);

      throw new BadRequestError({
        clientMessage: 'Validation error',
        operation: 'middleware:validate-query',
        context: {...flattened},
      });
    }

    req.validatedQuery = result.data;
    next();
  };

export const validateFile =
  (allowedMime: string[], maxSize = 1024 * 1024 * 10, callback?: (file: Express.Multer.File | undefined) => void) =>
    (req: Request, _res: Response, next: NextFunction) => {
      callback?.(req.file);

      if (!req.file) return next();

      if (!allowedMime.includes(req.file.mimetype)) {
        throw new BadRequestError({
          clientMessage: `Invalid file type. Allowed: ${allowedMime.join(', ')}`,
          operation: 'middleware:validate-file',
          context: {mimetype: req.file.mimetype},
        });
      }

      if (req.file.size > maxSize) {
        throw new BadRequestError({
          clientMessage: `File too large. Max ${Math.round(maxSize / (1024 * 1024))}MB.`,
          operation: 'middleware:validate-file',
          context: {size: req.file.size},
        });
      }

      next();
    };

export const validateMultipleFiles =
  (allowedMime: string[], maxSize = 1024 * 1024 * 10, callback?: (files: Express.Multer.File[] | undefined) => void) =>
    (req: Request, _res: Response, next: NextFunction) => {
      const files: Express.Multer.File[] = (req.files as Express.Multer.File[]) || [];
      callback?.(files);

      if (!files.length) return next();

      for (const file of files) {
        if (!allowedMime.includes(file.mimetype)) {
          throw new BadRequestError({
            clientMessage: `Invalid file type. Allowed: ${allowedMime.join(', ')}`,
            operation: 'middleware:validate-files',
            context: {filename: file.originalname, mimetype: file.mimetype},
          });
        }

        if (file.size > maxSize) {
          throw new BadRequestError({
            clientMessage: `File too large. Max ${Math.round(maxSize / (1024 * 1024))}MB.`,
            operation: 'middleware:validate-files',
            context: {filename: file.originalname, size: file.size},
          });
        }
      }

      next();
    };
