import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { Card } from '../components/Card';
import { useAuthStore } from '../store/auth';

const Professions = () => {
  const { token } = useAuthStore();
  const { data: courses } = useQuery({
    queryKey: ['courses'],
    queryFn: () => api.get('/courses', token),
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Кәсіптер тізімі (Профессии)</h1>
      <p className="mt-3 text-slate-600">
        Цифрлық агро-саласының негізгі бағыттары бойынша авторлық оқу бағдарламалары.
      </p>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {courses?.map((course: any) => (
          <Card key={course.id} title={course.title} subtitle={`${course.durationWeeks} апта`}>
            <p className="text-sm text-slate-600">{course.summary}</p>
            <div className="mt-4 flex flex-wrap gap-2 text-xs uppercase text-slate-500">
              {course.skills.map((skill: string) => (
                <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-primary">
                  {skill}
                </span>
              ))}
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Professions;
