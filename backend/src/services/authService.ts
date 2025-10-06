import { Role } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../utils/prisma';
import { signToken } from '../utils/jwt';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(2),
  region: z.string().optional(),
  role: z.nativeEnum(Role).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const registerUser = async (payload: unknown) => {
  const data = registerSchema.parse(payload);
  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    throw new Error('Пайдаланушы бар');
  }
  const passwordHash = await bcrypt.hash(data.password, 10);
  const role = data.role ?? Role.student;
  const user = await prisma.user.create({
    data: {
      email: data.email,
      passwordHash,
      name: data.name,
      region: data.region,
      role,
    },
  });
  const token = signToken({
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  });
  return { user, token };
};

export const loginUser = async (payload: unknown) => {
  const data = loginSchema.parse(payload);
  const user = await prisma.user.findUnique({ where: { email: data.email } });
  if (!user) {
    throw new Error('Қате логин немесе құпиясөз');
  }
  const valid = await bcrypt.compare(data.password, user.passwordHash);
  if (!valid) {
    throw new Error('Қате логин немесе құпиясөз');
  }
  const token = signToken({
    userId: user.id,
    role: user.role,
    email: user.email,
    name: user.name,
  });
  return { user, token };
};
