import { NextFunction, Response } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthenticatedRequest } from '../types';

interface TokenPayload {
  userId: string;
  role: string;
  email: string;
  name: string;
}

export const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ message: 'Токен жоқ' });
  }
  const [, token] = authHeader.split(' ');
  if (!token) {
    return res.status(401).json({ message: 'Токен табылмады' });
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
    req.user = {
      id: payload.userId,
      role: payload.role as any,
      email: payload.email,
      name: payload.name,
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Токен қате' });
  }
};

export const optionalAuth = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return next();
  }
  const [, token] = authHeader.split(' ');
  if (!token) {
    return next();
  }
  try {
    const payload = jwt.verify(token, env.jwtSecret) as TokenPayload;
    req.user = {
      id: payload.userId,
      role: payload.role as any,
      email: payload.email,
      name: payload.name,
    };
  } catch (error) {
    console.warn('Optional auth token invalid');
  }
  next();
};

export const requireRole = (roles: string | string[]) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Аутентификация қажет' });
    }
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ message: 'Қол жеткізуге рұқсат жоқ' });
    }
    next();
  };
};
