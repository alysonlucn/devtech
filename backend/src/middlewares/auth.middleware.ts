import { NextFunction, Request, Response } from 'express';
import { UnauthorizedError } from '../errors/app.errors';
import { verifyAccessToken } from '../utils/jwt';

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next(new UnauthorizedError('Cabeçalho de autorização ausente ou inválido'));
    return;
  }

  const token = authHeader.slice(7);
  try {
    req.user = verifyAccessToken(token);
    next();
  } catch {
    next(new UnauthorizedError('Token inválido ou expirado'));
  }
}

export function optionalAuthMiddleware(req: Request, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    next();
    return;
  }

  const token = authHeader.slice(7);
  try {
    req.user = verifyAccessToken(token);
  } catch {
    // ignore invalid token for optional auth
  }
  next();
}
