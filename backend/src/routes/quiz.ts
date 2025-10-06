import { Router } from 'express';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { prisma } from '../config/prisma.js';
import { requireAuth, AuthRequest } from '../middleware/auth.js';

interface QuizSessionState {
  courseId: string;
  userId: string;
  quizId: string;
  asked: number;
  correct: number;
  history: { questionId: string; difficulty: number; correct: boolean; skillTag: string }[];
  remaining: Map<number, string[]>; // difficulty -> questionIds
}

const sessions = new Map<string, QuizSessionState>();

const router = Router();

const startSchema = z.object({});
const answerSchema = z.object({
  sessionId: z.string(),
  questionId: z.string(),
  choice: z.number(),
});

function pickQuestion(session: QuizSessionState, difficulty: number) {
  for (let diff = difficulty; diff <= 3 && diff >= 1; ) {
    const bucket = session.remaining.get(diff) || [];
    if (bucket.length > 0) {
      const questionId = bucket.shift()!;
      session.remaining.set(diff, bucket);
      return { questionId, difficulty: diff };
    }
    diff = difficulty > 1 ? diff - 1 : diff + 1;
    if (diff < 1 || diff > 3) break;
  }
  return null;
}

router.post('/:courseId/start', requireAuth, async (req: AuthRequest, res) => {
  startSchema.parse(req.body ?? {});
  const { courseId } = req.params;
  const quiz = await prisma.quiz.findFirst({ where: { courseId }, include: { questions: true } });
  if (!quiz || quiz.questions.length === 0) {
    return res.status(404).json({ message: 'Тест табылмады' });
  }
  const sessionId = randomUUID();
  const remaining = new Map<number, string[]>();
  quiz.questions.forEach((q) => {
    const bucket = remaining.get(q.difficulty) || [];
    bucket.push(q.id);
    remaining.set(q.difficulty, bucket);
  });
  const session: QuizSessionState = {
    courseId,
    quizId: quiz.id,
    userId: req.user!.id,
    asked: 0,
    correct: 0,
    history: [],
    remaining,
  };
  sessions.set(sessionId, session);
  const next = pickQuestion(session, 2);
  if (!next) {
    return res.status(500).json({ message: 'Сұрақтар жетіспейді' });
  }
  const question = quiz.questions.find((q) => q.id === next.questionId)!;
  res.json({ sessionId, question: { id: question.id, text: question.text, options: question.options } });
});

router.post('/:courseId/answer', requireAuth, async (req: AuthRequest, res) => {
  const parsed = answerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ errors: parsed.error.flatten() });
  }
  const { sessionId, questionId, choice } = parsed.data;
  const session = sessions.get(sessionId);
  if (!session || session.userId !== req.user!.id) {
    return res.status(404).json({ message: 'Сессия табылмады' });
  }
  const question = await prisma.question.findUnique({ where: { id: questionId } });
  if (!question) {
    return res.status(404).json({ message: 'Сұрақ табылмады' });
  }
  const options = question.options as { text: string; isCorrect: boolean }[];
  const correct = options[choice]?.isCorrect ?? false;
  session.asked += 1;
  if (correct) session.correct += 1;
  session.history.push({ questionId, difficulty: question.difficulty, correct, skillTag: question.skillTag });

  let nextDifficulty = question.difficulty;
  if (correct) {
    nextDifficulty = Math.min(3, question.difficulty + 1);
  } else {
    nextDifficulty = Math.max(1, question.difficulty - 1);
  }
  if (session.asked >= 10) {
    return res.json({ done: true });
  }
  const next = pickQuestion(session, nextDifficulty);
  if (!next) {
    return res.json({ done: true });
  }
  const nextQuestion = await prisma.question.findUnique({ where: { id: next.questionId } });
  if (!nextQuestion) {
    return res.json({ done: true });
  }
  res.json({
    done: false,
    question: {
      id: nextQuestion.id,
      text: nextQuestion.text,
      options: nextQuestion.options,
    },
  });
});

router.post('/:courseId/finish', requireAuth, async (req: AuthRequest, res) => {
  const sessionId = z.string().parse(req.body?.sessionId);
  const session = sessions.get(sessionId);
  if (!session || session.userId !== req.user!.id) {
    return res.status(404).json({ message: 'Сессия табылмады' });
  }
  const skillCounts = new Map<string, { correct: number; total: number }>();
  session.history.forEach((item) => {
    const entry = skillCounts.get(item.skillTag) || { correct: 0, total: 0 };
    entry.total += 1;
    if (item.correct) entry.correct += 1;
    skillCounts.set(item.skillTag, entry);
  });
  const skillBreakdown = Array.from(skillCounts.entries()).map(([skill, data]) => ({
    skill,
    correct: data.correct,
    total: data.total,
    score: data.total ? data.correct / data.total : 0,
  }));
  const overall = session.asked ? session.correct / session.asked : 0;
  let badge: { id: string; level: string; skillTag: string } | null = null;
  if (overall >= 0.8) {
    const topSkill = skillBreakdown.sort((a, b) => b.score - a.score)[0];
    if (topSkill) {
      const created = await prisma.badge.create({
        data: {
          userId: session.userId,
          name: `${topSkill.skill} шебері`,
          skillTag: topSkill.skill,
          level: 'Advanced',
        },
      });
      badge = { id: created.id, level: created.level, skillTag: created.skillTag };
    }
  } else if (overall >= 0.5) {
    const skill = skillBreakdown.sort((a, b) => b.score - a.score)[0];
    if (skill) {
      const created = await prisma.badge.create({
        data: {
          userId: session.userId,
          name: `${skill.skill} базасы`,
          skillTag: skill.skill,
          level: 'Standard',
        },
      });
      badge = { id: created.id, level: created.level, skillTag: created.skillTag };
    }
  }

  const remediation = skillBreakdown
    .filter((skill) => skill.score < 0.5)
    .map((skill) => skill.skill);

  sessions.delete(sessionId);

  res.json({
    score: overall,
    badge,
    remediation,
    path: session.history,
    skills: skillBreakdown,
  });
});

export default router;
