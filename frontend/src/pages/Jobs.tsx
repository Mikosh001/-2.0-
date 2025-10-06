import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useToast } from '../components/Toast';

interface Job {
  id: string;
  title: string;
  city: string;
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  skillsRequired: string[];
  matchScore?: number;
  reason?: string[];
}

const Jobs = () => {
  const { notify } = useToast();
  const { data } = useQuery<Job[]>({
    queryKey: ['jobs', 'match'],
    queryFn: async () => {
      const res = await api.get('/jobs', { params: { matchFor: 'me' } });
      return res.data;
    }
  });

  const apply = async (jobId: string) => {
    await api.post(`/jobs/${jobId}/apply`);
    notify('Өтінім жіберілді (Заявка отправлена)');
  };

  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      <h1>Вакансиялар (Вакансии)</h1>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {data?.map((job) => (
          <Card
            key={job.id}
            title={`${job.title} · ${job.city}`}
            subtitle={
              job.matchScore !== undefined
                ? `Match ${Math.round(job.matchScore * 100)}% · ${job.reason?.join(', ')}`
                : undefined
            }
            actions={
              <Button onClick={() => apply(job.id)}>
                Өтінім беру (Отклик)
              </Button>
            }
          >
            <p>{job.description}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {job.skillsRequired.map((skill) => (
                <span key={skill} style={{ background: '#edf7ed', padding: '0.25rem 0.75rem', borderRadius: '12px' }}>
                  {skill}
                </span>
              ))}
            </div>
            <p>
              {job.salaryMin && job.salaryMax
                ? `₸${job.salaryMin.toLocaleString()} - ₸${job.salaryMax.toLocaleString()}`
                : 'Келісім бойынша'}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Jobs;
