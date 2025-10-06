import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { ProgressBar } from '../components/ProgressBar';

interface Enrollment {
  id: string;
  progress: number;
  course: {
    id: string;
    title: string;
    summary: string;
    skills: string[];
  };
}

interface PortfolioResponse {
  enrollments: Enrollment[];
}

const Learning = () => {
  const { data } = useQuery<PortfolioResponse>({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const res = await api.get('/portfolio/me');
      return res.data;
    }
  });

  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      <h1>Оқыту прогрессі (Прогресс обучения)</h1>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {data?.enrollments?.map((enrollment) => (
          <Card
            key={enrollment.id}
            title={enrollment.course.title}
            subtitle="Дағдылар (Навыки)"
            actions={
              <Button onClick={() => (window.location.href = `/course/${enrollment.course.id}`)}>
                Жалғастыру (Продолжить)
              </Button>
            }
          >
            <p>{enrollment.course.summary}</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {enrollment.course.skills.map((skill) => (
                <span key={skill} style={{ background: '#e8f8f0', padding: '0.25rem 0.75rem', borderRadius: '999px' }}>
                  {skill}
                </span>
              ))}
            </div>
            <ProgressBar value={enrollment.progress} />
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Learning;
