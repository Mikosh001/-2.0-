import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export const signToken = (payload: { userId: string; role: string; email: string; name: string }) =>
  jwt.sign(payload, env.jwtSecret, { expiresIn: '12h' });
