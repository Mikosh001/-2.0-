import { createContext, useContext, useMemo, useState } from 'react';
import { api } from '../api/client';
import { useAuthStore } from './auth';

interface QuizQuestion {
  id: string;
  text: string;
  options: { text: string; isCorrect?: boolean }[];
}

interface QuizContextValue {
  sessionId: string | null;
  currentQuestion: QuizQuestion | null;
  startQuiz: (courseId: string) => Promise<void>;
  submitAnswer: (courseId: string, choice: number) => Promise<boolean>;
  finishQuiz: (courseId: string) => Promise<any>;
}

const QuizContext = createContext<QuizContextValue | undefined>(undefined);

export const QuizProvider = ({ children }: { children: React.ReactNode }) => {
  const { token } = useAuthStore();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);

  const startQuiz = async (courseId: string) => {
    if (!token) throw new Error('Тіркелу қажет');
    const response = await api.post<{ sessionId: string; question: QuizQuestion }>(
      `/quiz/${courseId}/start`,
      {},
      token
    );
    setSessionId(response.sessionId);
    setCurrentQuestion(response.question);
  };

  const submitAnswer = async (courseId: string, choice: number) => {
    if (!sessionId || !currentQuestion) return false;
     if (!token) throw new Error('Тіркелу қажет');
    const response = await api.post<{ done: boolean; question?: QuizQuestion }>(
      `/quiz/${courseId}/answer`,
      { sessionId, questionId: currentQuestion.id, choice },
      token
    );
    if (response.done) {
      setCurrentQuestion(null);
      return true;
    }
    if (response.question) {
      setCurrentQuestion(response.question);
    }
    return false;
  };

  const finishQuiz = async (courseId: string) => {
    if (!sessionId) return null;
    if (!token) throw new Error('Тіркелу қажет');
    const summary = await api.post(`/quiz/${courseId}/finish`, { sessionId }, token);
    setSessionId(null);
    setCurrentQuestion(null);
    return summary;
  };

  const value = useMemo(
    () => ({ sessionId, currentQuestion, startQuiz, submitAnswer, finishQuiz }),
    [sessionId, currentQuestion]
  );

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error('QuizProvider жоқ');
  return ctx;
};
