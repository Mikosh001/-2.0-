import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuthStore } from '../store/auth';
import { ProgressBar } from '../components/ProgressBar';
import { Link } from 'react-router-dom';

const Learning = () => {
  const { token } = useAuthStore();
  const { data: enrollments } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => api.get('/me/enrollments', token),
    enabled: Boolean(token),
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Оқу прогресі (Прогресс)</h1>
      <div className="mt-8 space-y-6">
        {enrollments?.map((enrollment: any) => (
          <div key={enrollment.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-primary">{enrollment.course.title}</h2>
                <p className="text-sm text-slate-600">{enrollment.course.summary}</p>
              </div>
              <div className="w-full md:w-1/3">
                <ProgressBar value={enrollment.progress} />
                <p className="mt-2 text-sm text-slate-500">{enrollment.progress}%</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-3 text-xs uppercase text-slate-500">
              {enrollment.course.skills.map((skill: string) => (
                <span key={skill} className="rounded-full bg-success/10 px-3 py-1 text-success">
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Link
                to={`/course/${enrollment.courseId}`}
                className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-600"
              >
                Сабаққа өту (Перейти)
              </Link>
              <Link
                to={`/quiz/${enrollment.courseId}`}
                className="rounded-md border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
              >
                Тест тапсыру (Тест)
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Learning;
