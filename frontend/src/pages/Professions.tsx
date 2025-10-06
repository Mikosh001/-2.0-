import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface Course {
  id: string;
  title: string;
  summary: string;
  skills: string[];
  durationWeeks: number;
}

const Professions = () => {
  const { data } = useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      const res = await api.get('/courses');
      return res.data;
    }
  });

  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      <h1>Кәсіптер тізімі (Список профессий)</h1>
      <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))' }}>
        {data?.map((course) => (
          <Card
            key={course.id}
            title={course.title}
            subtitle={`Ұзақтығы ${course.durationWeeks} апта (Длительность)`}
            actions={<Button onClick={() => (window.location.href = `/auth/register`)}>Қосылу (Присоединиться)</Button>}
          >
            <p>{course.summary}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {course.skills.map((skill) => (
                <span key={skill} style={{ background: '#e8f1ff', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
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
