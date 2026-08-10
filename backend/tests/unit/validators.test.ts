import { describe, it, expect } from 'vitest';
import { registerSchema, loginSchema } from '../../src/validators/schemas';

describe('Auth Validators', () => {
  it('validates register schema', () => {
    const result = registerSchema.safeParse({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });

  it('rejects short password', () => {
    const result = registerSchema.safeParse({
      name: 'John',
      email: 'john@example.com',
      password: 'short',
    });
    expect(result.success).toBe(false);
  });

  it('validates login schema', () => {
    const result = loginSchema.safeParse({
      email: 'john@example.com',
      password: 'password123',
    });
    expect(result.success).toBe(true);
  });
});
