import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface Mentor {
  id: string;
  skills: string[];
  bio: string;
  calendarUrl?: string;
  user: {
    name: string;
    region?: string;
  };
}

const Mentors = () => {
  const { data } = useQuery<Mentor[]>({
    queryKey: ['mentors'],
    queryFn: async () => {
      const res = await api.get('/mentors');
      return res.data;
    }
  });

  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      <h1>Тәлімгерлер (Наставники)</h1>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {data?.map((mentor) => (
          <Card
            key={mentor.id}
            title={`${mentor.user.name} · ${mentor.user.region ?? 'KZ'}`}
            subtitle={mentor.skills.join(' · ')}
            actions={
              mentor.calendarUrl ? (
                <Button onClick={() => window.open(mentor.calendarUrl, '_blank')}>Брондау (Бронь)</Button>
              ) : undefined
            }
          >
            <p>{mentor.bio}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Mentors;
