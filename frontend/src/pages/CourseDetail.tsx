import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuthStore } from '../store/auth';

const CourseDetail = () => {
  const { id } = useParams();
  const { token } = useAuthStore();
  const { data: course } = useQuery({
    queryKey: ['course', id],
    queryFn: () => api.get(`/courses/${id}`, token),
    enabled: Boolean(id && token),
  });
  const { data: lessons } = useQuery({
    queryKey: ['lessons', id],
    queryFn: () => api.get(`/courses/${id}/lessons`, token),
    enabled: Boolean(id && token),
  });

  if (!course) return null;

  return (
    <section className="mx-auto max-w-5xl px-4 py-16">
      <h1 className="text-3xl font-bold text-primary">{course.title}</h1>
      <p className="mt-2 text-slate-600">{course.summary}</p>
      <div className="mt-6 flex flex-wrap gap-2 text-xs uppercase text-slate-500">
        {course.skills.map((skill: string) => (
          <span key={skill} className="rounded-full bg-primary/10 px-3 py-1 text-primary">
            {skill}
          </span>
        ))}
      </div>
      <h2 className="mt-10 text-2xl font-semibold text-slate-800">Сабақтар (Уроки)</h2>
      <ol className="mt-4 space-y-4">
        {lessons?.map((lesson: any) => (
          <li key={lesson.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">{lesson.type.toUpperCase()}</p>
                <h3 className="text-lg font-semibold text-slate-800">{lesson.title}</h3>
              </div>
              <span className="text-xs text-slate-400">Қадам {lesson.order}</span>
            </div>
            {lesson.contentMd && (
              <p className="mt-3 whitespace-pre-line text-sm text-slate-600">{lesson.contentMd}</p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
};

export default CourseDetail;
