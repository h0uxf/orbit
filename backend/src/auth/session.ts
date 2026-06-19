import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const SESSION_COOKIE = 'orbit_session';
export const PKCE_COOKIE = 'orbit_pkce';

export interface SessionPayload {
  userId: string;
}

export function createSessionToken(userId: string): string {
  return jwt.sign({ userId } satisfies SessionPayload, env.SESSION_SECRET, { expiresIn: '30d' });
}

export function verifySessionToken(token: string): SessionPayload | null {
  try {
    return jwt.verify(token, env.SESSION_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? ('none' as const) : ('lax' as const),
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

export const pkceCookieOptions = {
  httpOnly: true,
  secure: env.isProduction,
  sameSite: env.isProduction ? ('none' as const) : ('lax' as const),
  maxAge: 10 * 60 * 1000,
};
