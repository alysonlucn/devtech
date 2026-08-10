import jwt, { SignOptions } from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env';
import { JwtPayload } from '../types/express.d';
import { UserRole } from '../enums';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export function signAccessToken(payload: JwtPayload): string {
  const options: SignOptions = { expiresIn: env.JWT_ACCESS_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, options);
}

export function signRefreshToken(userId: string, tokenId: string): string {
  const options: SignOptions = { expiresIn: env.JWT_REFRESH_EXPIRES_IN as SignOptions['expiresIn'] };
  return jwt.sign({ sub: userId, jti: tokenId }, env.JWT_REFRESH_SECRET, options);
}

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET) as JwtPayload;
  return decoded;
}

export function verifyRefreshToken(token: string): { sub: string; jti: string } {
  const decoded = jwt.verify(token, env.JWT_REFRESH_SECRET) as { sub: string; jti: string };
  return decoded;
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function createTokenPayload(user: {
  id: string;
  email: string;
  role: UserRole;
}): JwtPayload {
  return { sub: user.id, email: user.email, role: user.role };
}
