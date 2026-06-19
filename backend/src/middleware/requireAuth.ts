import type { NextFunction, Request, Response } from 'express';
import { SESSION_COOKIE, verifySessionToken } from '../auth/session.js';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.[SESSION_COOKIE];
  const session = token ? verifySessionToken(token) : null;
  if (!session) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }
  req.userId = session.userId;
  next();
}
