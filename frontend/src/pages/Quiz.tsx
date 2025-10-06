import { useParams } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/client';
import { useQuizStore } from '../store/quiz';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useToast } from '../components/Toast';

interface Question {
  id: string;
  text: string;
  options: string[];
}

const QuizPage = () => {
  const { courseId } = useParams();
  const { notify } = useToast();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { sessionId, currentQuestion, setSession, setQuestion, pushResult, reset } = useQuizStore();

  const startQuiz = async () => {
    if (!courseId) return;
    setLoading(true);
    try {
      const res = await api.post(`/quiz/${courseId}/start`);
      setSession(res.data.sessionId, res.data.question);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  const answer = async (choice: string) => {
    if (!sessionId || !currentQuestion || !courseId) return;
    const res = await api.post(`/quiz/${courseId}/answer`, {
      sessionId,
      questionId: currentQuestion.id,
      choice
    });
    pushResult(currentQuestion.id, res.data.correct);
    if (res.data.finished) {
      const finish = await api.post(`/quiz/${courseId}/finish`, { sessionId });
      setResult(finish.data);
      notify('Тест аяқталды! (Тест завершен)');
      reset();
    } else {
      setQuestion(res.data.nextQuestion);
    }
  };

  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      <h1>Адаптив тест (Адаптивный тест)</h1>
      {!sessionId && !currentQuestion && !result && (
        <Button onClick={startQuiz} disabled={loading}>
          Бастау (Начать)
        </Button>
      )}
      {currentQuestion && (
        <Card title={currentQuestion.text}>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            {currentQuestion.options.map((option) => (
              <Button key={option} variant="secondary" onClick={() => answer(option)}>
                {option}
              </Button>
            ))}
          </div>
        </Card>
      )}
      {result && (
        <Card title={`Нәтиже ${Math.round(result.skill_score * 100)}%`}>
          <p>Дұрыс жауаптар: {result.correct}/{result.asked}</p>
          {result.badge && (
            <p>
              Жаңа бейдж: {result.badge.name} · {result.badge.level}
            </p>
          )}
          {result.remediation?.length > 0 && (
            <p>Жақсарту керек дағдылар: {result.remediation.join(', ')}</p>
          )}
        </Card>
      )}
    </section>
  );
};

export default QuizPage;
