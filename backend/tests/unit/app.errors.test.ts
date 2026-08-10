import { describe, it, expect } from 'vitest';
import {
  NotFoundError,
  ValidationError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from '../../src/errors/app.errors';

describe('App Errors', () => {
  it('creates NotFoundError with 404', () => {
    const err = new NotFoundError('Usuário não encontrado');
    expect(err.statusCode).toBe(404);
    expect(err.message).toBe('Usuário não encontrado');
  });

  it('creates ValidationError with errors array', () => {
    const errors = [{ field: 'email', message: 'Inválido' }];
    const err = new ValidationError('Falha na validação', errors);
    expect(err.statusCode).toBe(400);
    expect(err.errors).toEqual(errors);
  });

  it('creates UnauthorizedError with 401', () => {
    expect(new UnauthorizedError().statusCode).toBe(401);
  });

  it('creates ForbiddenError with 403', () => {
    expect(new ForbiddenError().statusCode).toBe(403);
  });

  it('creates ConflictError with 409', () => {
    expect(new ConflictError().statusCode).toBe(409);
  });
});
