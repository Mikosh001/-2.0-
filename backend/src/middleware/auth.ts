import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Тіркелу қажет' });
  }

  try {
    const token = authHeader.split(' ')[1];
    const payload = jwt.verify(token, env.jwtSecret) as {
      userId: string;
      role: string;
      email: string;
      name: string;
    };
    req.user = {
      id: payload.userId,
      role: payload.role as any,
      email: payload.email,
      name: payload.name
    };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Сессия жарамсыз' });
  }
};

export const requireRole = (roles: Array<'student' | 'employer' | 'admin'>) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Рұқсат жоқ' });
    }
    next();
  };
};
