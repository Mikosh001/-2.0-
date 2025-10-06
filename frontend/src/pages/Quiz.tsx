import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuiz } from '../store/quiz';
import { Button } from '../components/Button';
import { useUI } from '../store/ui';

const QuizPage = () => {
  const { courseId } = useParams();
  const { startQuiz, currentQuestion, submitAnswer, finishQuiz } = useQuiz();
  const { showToast } = useUI();
  const [started, setStarted] = useState(false);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    setSummary(null);
  }, [courseId]);

  const handleStart = async () => {
    if (!courseId) return;
    await startQuiz(courseId);
    setStarted(true);
  };

  const handleAnswer = async (choice: number) => {
    if (!courseId) return;
    const done = await submitAnswer(courseId, choice);
    if (done) {
      const result = await finishQuiz(courseId);
      setSummary(result);
      showToast('Тест аяқталды (Тест завершен)');
      setStarted(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Адаптив тест</h1>
      {!started && !summary && (
        <Button className="mt-6" onClick={handleStart}>
          Бастау (Начать)
        </Button>
      )}
      {currentQuestion && (
        <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-semibold text-primary">Сұрақ</p>
          <h2 className="mt-2 text-xl font-semibold text-slate-800">{currentQuestion.text}</h2>
          <div className="mt-4 space-y-3">
            {currentQuestion.options.map((option, idx) => (
              <button
                key={option.text}
                onClick={() => handleAnswer(idx)}
                className="w-full rounded-lg border border-primary px-4 py-3 text-left text-sm font-semibold text-primary hover:bg-primary/10"
              >
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}
      {summary && (
        <div className="mt-10 space-y-6">
          <div className="rounded-2xl border border-success/40 bg-success/10 p-6">
            <h2 className="text-xl font-semibold text-success">Нәтиже</h2>
            <p className="mt-2 text-sm text-slate-700">Дұрыс жауаптар: {(summary.score * 100).toFixed(0)}%</p>
            {summary.badge ? (
              <p className="mt-3 text-sm text-primary">
                Жаңа бейдж: {summary.badge.skillTag} — {summary.badge.level}
              </p>
            ) : (
              <p className="mt-3 text-sm text-slate-600">
                Қайта қарау керек дағдылар: {summary.remediation.join(', ') || 'барлығы жақсы'}
              </p>
            )}
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h3 className="text-lg font-semibold text-slate-800">Қабілеттер бойынша</h3>
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {summary.skills.map((skill: any) => (
                <li key={skill.skill}>
                  {skill.skill}: {(skill.score * 100).toFixed(0)}%
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </section>
  );
};

export default QuizPage;
