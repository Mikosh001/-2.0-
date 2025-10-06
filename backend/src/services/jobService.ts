import { Role } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '../utils/prisma';

const jobSchema = z.object({
  title: z.string().min(3),
  city: z.string().min(2),
  salaryMin: z.number().int().optional(),
  salaryMax: z.number().int().optional(),
  skillsRequired: z.array(z.string()).min(1),
  description: z.string().min(10),
});

export const listJobs = async (filters: { city?: string; skills?: string[] }) => {
  const { city, skills } = filters;
  return prisma.job.findMany({
    where: {
      AND: [
        city ? { city: { equals: city, mode: 'insensitive' } } : {},
        skills && skills.length > 0
          ? {
              skillsRequired: {
                hasEvery: skills,
              },
            }
          : {},
      ],
    },
    include: {
      employer: { select: { id: true, name: true, region: true } },
    },
    orderBy: { createdAt: 'desc' },
  });
};

export const listJobsForUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      badges: true,
      enrollments: {
        include: {
          course: true,
        },
      },
    },
  });
  if (!user) throw new Error('Пайдаланушы табылмады');
  const skillSet = new Set<string>();
  user.badges.forEach((badge) => skillSet.add(badge.skillTag));
  user.enrollments
    .filter((en) => en.progress >= 80)
    .forEach((en) => en.course.skills.forEach((skill) => skillSet.add(skill)));
  const jobs = await prisma.job.findMany({
    include: { employer: { select: { id: true, name: true, region: true } } },
  });
  return jobs
    .map((job) => {
      const matches = job.skillsRequired.filter((skill) => skillSet.has(skill));
      const score = job.skillsRequired.length
        ? matches.length / job.skillsRequired.length
        : 0;
      return {
        ...job,
        matchScore: Number(score.toFixed(2)),
        matchReason: matches,
      };
    })
    .sort((a, b) => b.matchScore - a.matchScore);
};

export const createJob = async (payload: unknown, employerId: string) => {
  const data = jobSchema.parse(payload);
  return prisma.job.create({
    data: {
      ...data,
      employerId,
    },
  });
};

export const applyToJob = async (jobId: string, userId: string) => {
  const job = await prisma.job.findUnique({ where: { id: jobId } });
  if (!job) throw new Error('Вакансия табылмады');
  const existing = await prisma.application.findFirst({ where: { jobId, userId } });
  if (existing) throw new Error('Өтінім бұрын жіберілген');
  return prisma.application.create({
    data: {
      jobId,
      userId,
    },
  });
};

export const listApplications = (userId: string, role: Role) => {
  if (role === Role.employer) {
    return prisma.application.findMany({
      where: { job: { employerId: userId } },
      include: {
        job: true,
        user: { select: { id: true, name: true, email: true, region: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
  return prisma.application.findMany({
    where: { userId },
    include: {
      job: true,
    },
    orderBy: { createdAt: 'desc' },
  });
};
