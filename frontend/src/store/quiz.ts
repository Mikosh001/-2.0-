import { create } from 'zustand';

interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
}

interface QuizState {
  sessionId: string | null;
  currentQuestion: QuizQuestion | null;
  history: Array<{ questionId: string; correct: boolean }>;
  setSession: (sessionId: string, question: QuizQuestion) => void;
  pushResult: (questionId: string, correct: boolean) => void;
  setQuestion: (question: QuizQuestion | null) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  sessionId: null,
  currentQuestion: null,
  history: [],
  setSession: (sessionId, question) => set({ sessionId, currentQuestion: question, history: [] }),
  pushResult: (questionId, correct) =>
    set((state) => ({ history: [...state.history, { questionId, correct }] })),
  setQuestion: (question) => set({ currentQuestion: question }),
  reset: () => set({ sessionId: null, currentQuestion: null, history: [] })
}));
