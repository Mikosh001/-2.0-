import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import Card from '../components/Card';
import Button from '../components/Button';
import BadgePill from '../components/BadgePill';
import { useQuizStore } from '../store/quizSession';
import { useToast } from '../utils/ToastContext';

interface QuizResponse {
  sessionId: string;
  question: {
    id: string;
    text: string;
    difficulty: number;
    skillTag: string;
    options: { text: string }[];
  };
}

interface FinishResponse {
  asked: number;
  correct: number;
  skill_score: number;
  badgeLevel: string | null;
  badge?: { id: string; name: string } | null;
  remediation: string[];
}

const QuizPage = () => {
  const { courseId } = useParams();
  const { setSession, currentQuestion, sessionId, pushAnswer, reset, history } = useQuizStore();
  const [finishData, setFinishData] = useState<FinishResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const { setToast } = useToast();

  useEffect(() => {
    const start = async () => {
      if (!courseId) return;
      setLoading(true);
      try {
        const { data } = await api.post<QuizResponse>(`/quiz/${courseId}/start`);
        setSession(data.sessionId, data.question);
      } catch (error) {
        setToast({ message: 'Квиз бастау сәтсіз (Ошибка запуска квиза)', type: 'error' });
      } finally {
        setLoading(false);
      }
    };
    start();
    return () => reset();
  }, [courseId, reset, setSession, setToast]);

  const submitAnswer = async (choice: string) => {
    if (!courseId || !sessionId || !currentQuestion) return;
    setLoading(true);
    try {
      const { data } = await api.post(`/quiz/${courseId}/answer`, {
        sessionId,
        questionId: currentQuestion.id,
        choice,
      });
      pushAnswer({ correct: Boolean(data.correct), nextQuestion: data.question });
      if (data.done || !data.question) {
        const finish = await api.post<FinishResponse>(`/quiz/${courseId}/finish`, { sessionId });
        setFinishData(finish.data);
        setToast({ message: 'Квиз аяқталды! (Квиз завершён)', type: 'success' });
      }
    } catch (error) {
      setToast({ message: 'Жауап жіберу қате (Ошибка ответа)', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  if (loading && !currentQuestion && !finishData) {
    return <p style={{ padding: '2rem' }}>Жүктелуде...</p>;
  }

  if (finishData) {
    return (
      <section className="container" style={{ padding: '2rem 0' }}>
        <Card title="Квиз нәтижесі (Результаты)">
          <p>
            Дұрыс жауаптар: {finishData.correct}/{finishData.asked} | Skill Score:{' '}
            {(finishData.skill_score * 100).toFixed(0)}%
          </p>
          {finishData.badge ? (
            <BadgePill color="gold" label={`Бейдж: ${finishData.badge.name}`} />
          ) : (
            <p>Бейдж берілмеді. Қайта дайындал! (Бейдж жоқ)</p>
          )}
          {finishData.remediation.length > 0 && (
            <div>
              <h4>Қайта қарау қажет дағдылар:</h4>
              <ul>
                {finishData.remediation.map((skill) => (
                  <li key={skill}>{skill}</li>
                ))}
              </ul>
            </div>
          )}
          <Button onClick={() => window.history.back()}>Кабинетке оралу</Button>
        </Card>
      </section>
    );
  }

  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      {currentQuestion ? (
        <Card
          title={`Сұрақ (${history.length + 1}/10)`}
          subtitle={`Қиындық: ${currentQuestion.difficulty} | Дағды: ${currentQuestion.skillTag}`}
        >
          <p>{currentQuestion.text}</p>
          <div style={{ display: 'grid', gap: '0.75rem', marginTop: '1rem' }}>
            {currentQuestion.options.map((option) => (
              <Button key={option.text} onClick={() => submitAnswer(option.text)} disabled={loading}>
                {option.text}
              </Button>
            ))}
          </div>
        </Card>
      ) : (
        <p>Келесі сұрақты күтіңіз...</p>
      )}
    </section>
  );
};

export default QuizPage;
