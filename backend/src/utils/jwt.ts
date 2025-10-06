import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export const signToken = (userId: string, role: string) => {
  return jwt.sign({ userId, role }, env.jwtSecret, { expiresIn: '7d' });
};
