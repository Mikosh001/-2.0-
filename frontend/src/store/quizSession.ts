import { create } from 'zustand';

interface QuizQuestion {
  id: string;
  text: string;
  difficulty: number;
  skillTag: string;
  options: { text: string }[];
}

interface QuizState {
  sessionId: string | null;
  currentQuestion: QuizQuestion | null;
  history: { questionId: string; correct: boolean; difficulty: number }[];
  setSession: (sessionId: string, question: QuizQuestion) => void;
  pushAnswer: (payload: {
    correct: boolean;
    nextQuestion?: QuizQuestion | null;
  }) => void;
  reset: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  sessionId: null,
  currentQuestion: null,
  history: [],
  setSession: (sessionId, question) => set({ sessionId, currentQuestion: question, history: [] }),
  pushAnswer: ({ correct, nextQuestion }) => {
    const { currentQuestion, history } = get();
    if (currentQuestion) {
      set({
        history: [...history, { questionId: currentQuestion.id, correct, difficulty: currentQuestion.difficulty }],
        currentQuestion: nextQuestion ?? null,
      });
    }
  },
  reset: () => set({ sessionId: null, currentQuestion: null, history: [] }),
}));
