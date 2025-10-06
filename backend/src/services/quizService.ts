import { Quiz, Question } from '@prisma/client';
import { randomUUID } from 'crypto';
import { prisma } from '../utils/prisma';

interface QuizSessionQuestion {
  id: string;
  text: string;
  difficulty: number;
  skillTag: string;
  options: { text: string; isCorrect: boolean }[];
}

interface QuizSessionState {
  sessionId: string;
  courseId: string;
  quizId: string;
  userId: string;
  history: {
    questionId: string;
    correct: boolean;
    difficulty: number;
    skillTag: string;
    selected: string;
  }[];
  questions: QuizSessionQuestion[];
  nextDifficulty: number;
}

const sessions = new Map<string, QuizSessionState>();

const mapQuestion = (question: Question): QuizSessionQuestion => ({
  id: question.id,
  text: question.text,
  difficulty: question.difficulty,
  skillTag: question.skillTag,
  options: (question.options as { text: string; isCorrect: boolean }[]) ?? [],
});

const pickQuestion = (session: QuizSessionState, difficulty: number) => {
  const askedIds = new Set(session.history.map((h) => h.questionId));
  const exact = session.questions.find(
    (q) => q.difficulty === difficulty && !askedIds.has(q.id),
  );
  if (exact) return exact;
  return session.questions.find((q) => !askedIds.has(q.id));
};

const resolveQuiz = async (courseId: string): Promise<Quiz & { questions: Question[] }> => {
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      quizzes: {
        include: {
          questions: true,
        },
      },
    },
  });
  if (!course || course.quizzes.length === 0) {
    throw new Error('Курс квизі табылмады');
  }
  const quiz = course.quizzes[0];
  if (quiz.questions.length === 0) {
    throw new Error('Квиз сұрақтары табылмады');
  }
  return quiz;
};

export const startQuizSession = async (courseId: string, userId: string) => {
  const quiz = await resolveQuiz(courseId);
  const sessionId = randomUUID();
  const questions = quiz.questions.map(mapQuestion);
  const session: QuizSessionState = {
    sessionId,
    courseId,
    quizId: quiz.id,
    userId,
    history: [],
    questions,
    nextDifficulty: 2,
  };
  sessions.set(sessionId, session);
  const first = pickQuestion(session, 2);
  if (!first) {
    throw new Error('Қолжетімді сұрақ табылмады');
  }
  return {
    sessionId,
    question: {
      id: first.id,
      text: first.text,
      difficulty: first.difficulty,
      skillTag: first.skillTag,
      options: first.options.map((o) => ({ text: o.text })),
    },
  };
};

export const answerQuizQuestion = async (
  payload: { sessionId: string; questionId: string; choice: string },
) => {
  const session = sessions.get(payload.sessionId);
  if (!session) {
    throw new Error('Сессия табылмады');
  }
  const question = session.questions.find((q) => q.id === payload.questionId);
  if (!question) {
    throw new Error('Сұрақ жарамсыз');
  }
  const correctOption = question.options.find((o) => o.isCorrect);
  const isCorrect = correctOption?.text === payload.choice;
  session.history.push({
    questionId: question.id,
    correct: Boolean(isCorrect),
    difficulty: question.difficulty,
    skillTag: question.skillTag,
    selected: payload.choice,
  });
  if (session.history.length >= 10) {
    sessions.set(session.sessionId, session);
    return {
      done: true,
      correct: Boolean(isCorrect),
    };
  }
  const nextDifficulty = isCorrect
    ? Math.min(3, question.difficulty + 1)
    : Math.max(1, question.difficulty - 1);
  session.nextDifficulty = nextDifficulty;
  sessions.set(session.sessionId, session);
  const nextQuestion = pickQuestion(session, nextDifficulty);
  if (!nextQuestion) {
    return { done: true, correct: Boolean(isCorrect) };
  }
  return {
    correct: Boolean(isCorrect),
    question: {
      id: nextQuestion.id,
      text: nextQuestion.text,
      difficulty: nextQuestion.difficulty,
      skillTag: nextQuestion.skillTag,
      options: nextQuestion.options.map((o) => ({ text: o.text })),
    },
  };
};

export const finishQuizSession = async (payload: { sessionId: string }) => {
  const session = sessions.get(payload.sessionId);
  if (!session) {
    throw new Error('Сессия табылмады');
  }
  const history = session.history;
  const asked = history.length;
  const correct = history.filter((h) => h.correct).length;
  const skillScore = asked ? correct / asked : 0;
  const perSkill = history.reduce<Record<string, { asked: number; correct: number }>>(
    (acc, item) => {
      if (!acc[item.skillTag]) {
        acc[item.skillTag] = { asked: 0, correct: 0 };
      }
      acc[item.skillTag].asked += 1;
      if (item.correct) acc[item.skillTag].correct += 1;
      return acc;
    },
    {},
  );

  const remediation = Object.entries(perSkill)
    .filter(([_, value]) => value.correct / value.asked < 0.5)
    .map(([skill]) => skill);

  let badgeLevel: 'Advanced' | 'Standard' | null = null;
  if (skillScore >= 0.8) badgeLevel = 'Advanced';
  else if (skillScore >= 0.5) badgeLevel = 'Standard';

  let badge = null;
  if (badgeLevel) {
    const course = await prisma.course.findUnique({ where: { id: session.courseId } });
    if (course) {
      badge = await prisma.badge.create({
        data: {
          userId: session.userId,
          name: `${course.title} ${badgeLevel} бейдж`,
          skillTag: course.skills[0] ?? 'Skill',
          level: badgeLevel,
        },
      });
      await prisma.enrollment.updateMany({
        where: { userId: session.userId, courseId: session.courseId },
        data: { progress: 100 },
      });
    }
  }

  sessions.delete(session.sessionId);

  return {
    asked,
    correct,
    skill_score: skillScore,
    badge,
    badgeLevel,
    remediation,
    path_taken: history.map((h) => ({
      questionId: h.questionId,
      difficulty: h.difficulty,
      correct: h.correct,
      skillTag: h.skillTag,
    })),
    per_skill: Object.entries(perSkill).map(([skill, value]) => ({
      skill,
      asked: value.asked,
      correct: value.correct,
    })),
  };
};
