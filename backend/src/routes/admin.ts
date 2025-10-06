import { Router } from 'express';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, requireRole('admin'));

const courseSchema = z.object({
  title: z.string(),
  slug: z.string(),
  summary: z.string(),
  skills: z.array(z.string()).min(1),
  durationWeeks: z.number().min(1),
});

router.get('/courses', async (_req, res) => {
  const courses = await prisma.course.findMany({ include: { lessons: true, quizzes: true } });
  res.json(courses);
});

router.post('/courses', async (req, res) => {
  const parsed = courseSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const course = await prisma.course.create({ data: parsed.data });
  res.status(201).json(course);
});

router.put('/courses/:id', async (req, res) => {
  const parsed = courseSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const course = await prisma.course.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(course);
});

router.delete('/courses/:id', async (req, res) => {
  await prisma.course.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

const lessonSchema = z.object({
  courseId: z.string(),
  type: z.enum(['video', 'task', 'sim']),
  title: z.string(),
  videoUrl: z.string().nullable().optional(),
  contentMd: z.string().nullable().optional(),
  order: z.number(),
});

router.post('/lessons', async (req, res) => {
  const parsed = lessonSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const lesson = await prisma.lesson.create({ data: parsed.data });
  res.status(201).json(lesson);
});

router.put('/lessons/:id', async (req, res) => {
  const parsed = lessonSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const lesson = await prisma.lesson.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(lesson);
});

router.delete('/lessons/:id', async (req, res) => {
  await prisma.lesson.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

const questionSchema = z.object({
  quizId: z.string(),
  text: z.string(),
  skillTag: z.string(),
  difficulty: z.number().min(1).max(3),
  options: z.array(z.object({ text: z.string(), isCorrect: z.boolean() })).min(2),
});

router.post('/questions', async (req, res) => {
  const parsed = questionSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const question = await prisma.question.create({ data: parsed.data });
  res.status(201).json(question);
});

router.put('/questions/:id', async (req, res) => {
  const parsed = questionSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const question = await prisma.question.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(question);
});

router.delete('/questions/:id', async (req, res) => {
  await prisma.question.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

const adminJobSchema = z.object({
  employerId: z.string(),
  title: z.string(),
  city: z.string(),
  salaryMin: z.number().nullable().optional(),
  salaryMax: z.number().nullable().optional(),
  skillsRequired: z.array(z.string()),
  description: z.string(),
});

router.post('/jobs', async (req, res) => {
  const parsed = adminJobSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const job = await prisma.job.create({ data: parsed.data });
  res.status(201).json(job);
});

router.put('/jobs/:id', async (req, res) => {
  const parsed = adminJobSchema.partial().safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ errors: parsed.error.flatten() });
  const job = await prisma.job.update({ where: { id: req.params.id }, data: parsed.data });
  res.json(job);
});

router.delete('/jobs/:id', async (req, res) => {
  await prisma.job.delete({ where: { id: req.params.id } });
  res.status(204).send();
});

export default router;
