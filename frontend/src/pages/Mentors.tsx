import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuthStore } from '../store/auth';
import { Card } from '../components/Card';

const Mentors = () => {
  const { token } = useAuthStore();
  const { data: mentors } = useQuery({
    queryKey: ['mentors'],
    queryFn: () => api.get('/mentors', token),
    enabled: Boolean(token),
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Тәлімгерлер (Наставники)</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {mentors?.map((mentor: any) => (
          <Card key={mentor.id} title={mentor.user.name} subtitle={mentor.skills.join(', ')}>
            <p className="text-sm text-slate-600">{mentor.bio}</p>
            {mentor.calendarUrl && (
              <a
                href={mentor.calendarUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex text-sm font-semibold text-primary"
              >
                Сессия брондау (Бронировать)
              </a>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Mentors;
