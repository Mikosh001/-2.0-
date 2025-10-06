import { prisma } from '../utils/prisma';

export const listCourses = async (filters: { skill?: string; search?: string }) => {
  const { skill, search } = filters;
  return prisma.course.findMany({
    where: {
      AND: [
        skill
          ? {
              skills: {
                has: skill,
              },
            }
          : {},
        search
          ? {
              OR: [
                { title: { contains: search, mode: 'insensitive' } },
                { summary: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
      ],
    },
    include: {
      lessons: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const getCourse = async (id: string) =>
  prisma.course.findUnique({
    where: { id },
    include: {
      lessons: { orderBy: { order: 'asc' } },
      quizzes: {
        include: {
          questions: true,
        },
      },
    },
  });

export const getLessonsByCourse = async (courseId: string) =>
  prisma.lesson.findMany({
    where: { courseId },
    orderBy: { order: 'asc' },
  });
