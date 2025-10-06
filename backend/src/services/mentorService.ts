import { prisma } from '../utils/prisma';

export const listMentors = () =>
  prisma.mentor.findMany({
    include: {
      user: {
        select: { id: true, name: true, region: true },
      },
    },
    orderBy: { id: 'asc' },
  });
