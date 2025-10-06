import { LessonType } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../utils/prisma';

const courseSchema = z.object({
  title: z.string().min(3),
  slug: z.string().min(3),
  summary: z.string().min(10),
  skills: z.array(z.string()).min(1),
  durationWeeks: z.number().int().min(1).max(52).optional(),
});

const lessonSchema = z.object({
  title: z.string().min(3),
  type: z.nativeEnum(LessonType),
  videoUrl: z.string().url().optional(),
  contentMd: z.string().optional(),
  order: z.number().int().min(1),
});

const questionSchema = z.object({
  text: z.string().min(5),
  skillTag: z.string().min(2),
  difficulty: z.number().int().min(1).max(3),
  options: z
    .array(
      z.object({
        text: z.string(),
        isCorrect: z.boolean(),
      }),
    )
    .min(2),
});

export const adminListCourses = () =>
  prisma.course.findMany({
    include: { lessons: true, quizzes: { include: { questions: true } } },
  });

export const adminCreateCourse = async (payload: unknown) => {
  const data = courseSchema.parse(payload);
  return prisma.course.create({ data });
};

export const adminUpdateCourse = async (id: string, payload: unknown) => {
  const data = courseSchema.partial().parse(payload);
  return prisma.course.update({ where: { id }, data });
};

export const adminDeleteCourse = (id: string) => prisma.course.delete({ where: { id } });

export const adminCreateLesson = (courseId: string, payload: unknown) => {
  const data = lessonSchema.parse(payload);
  return prisma.lesson.create({
    data: { ...data, courseId },
  });
};

export const adminUpdateLesson = (lessonId: string, payload: unknown) => {
  const data = lessonSchema.partial().parse(payload);
  return prisma.lesson.update({ where: { id: lessonId }, data });
};

export const adminDeleteLesson = (lessonId: string) =>
  prisma.lesson.delete({ where: { id: lessonId } });

export const adminCreateQuestion = async (courseId: string, payload: unknown) => {
  const data = questionSchema.parse(payload);
  const quiz = await prisma.quiz.findFirst({ where: { courseId } });
  if (!quiz) {
    throw new Error('Квиз табылмады');
  }
  return prisma.question.create({
    data: { ...data, quizId: quiz.id },
  });
};

export const adminUpdateQuestion = (questionId: string, payload: unknown) => {
  const data = questionSchema.partial().parse(payload);
  return prisma.question.update({ where: { id: questionId }, data });
};

export const adminDeleteQuestion = (questionId: string) =>
  prisma.question.delete({ where: { id: questionId } });

export const adminListJobs = () => prisma.job.findMany({ include: { employer: true } });
