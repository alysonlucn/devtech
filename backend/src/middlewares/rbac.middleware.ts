import { NextFunction, Request, Response } from 'express';
import { ForbiddenError } from '../errors/app.errors';
import { UserRole } from '../enums';

export function requireRole(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError('Autenticação necessária'));
      return;
    }

    if (!roles.includes(req.user.role)) {
      next(new ForbiddenError('Permissões insuficientes'));
      return;
    }

    next();
  };
}

export const adminOnly = requireRole(UserRole.ADMIN);
