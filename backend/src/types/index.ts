import { Role, User } from '@prisma/client';
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: Pick<User, 'id' | 'role' | 'email' | 'name'>;
}

export type UserRole = Role;
