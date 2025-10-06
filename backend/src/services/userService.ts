import { prisma } from '../utils/prisma';

export const getMe = (userId: string) =>
  prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      region: true,
      portfolioUrl: true,
    },
  });

export const getMyEnrollments = (userId: string) =>
  prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          lessons: true,
        },
      },
    },
  });

export const getPublicProfile = (userId: string) =>
  prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      region: true,
      badges: {
        select: { id: true, name: true, skillTag: true, level: true },
        orderBy: { issuedAt: 'desc' },
      },
    },
  });
