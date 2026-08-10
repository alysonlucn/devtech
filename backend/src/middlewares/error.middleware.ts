import { NextFunction, Request, Response } from 'express';
import { AppError } from '../errors/app.errors';
import { logger } from '../utils/logger';
import { sendError } from '../utils/response';
import { ZodError } from 'zod';

export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export function errorMiddleware(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof AppError) {
    sendError(res, err.message, { status: err.statusCode, errors: err.errors });
    return;
  }

  if (err instanceof ZodError) {
    const errors = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    sendError(res, 'Falha na validação', { status: 400, errors });
    return;
  }

  logger.error(err.message, { stack: err.stack });
  sendError(res, 'Erro interno do servidor', { status: 500 });
}
