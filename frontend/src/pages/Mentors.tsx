import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import Card from '../components/Card';
import Button from '../components/Button';

interface Mentor {
  id: string;
  skills: string[];
  bio: string;
  calendarUrl?: string | null;
  user: { name: string; region?: string | null };
}

const fetchMentors = async () => {
  const { data } = await api.get<Mentor[]>('/mentors');
  return data;
};

const Mentors = () => {
  const { data, isLoading } = useQuery({ queryKey: ['mentors'], queryFn: fetchMentors });
  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2>Тәлімгерлер</h2>
      {isLoading ? (
        <p>Жүктелуде...</p>
      ) : (
        <div className="card-grid">
          {data?.map((mentor) => (
            <Card key={mentor.id} title={mentor.user.name} subtitle={mentor.user.region ?? 'Қазақстан'}>
              <p>{mentor.bio}</p>
              <p>Дағдылар: {mentor.skills.join(', ')}</p>
              {mentor.calendarUrl && (
                <Button onClick={() => window.open(mentor.calendarUrl!, '_blank')}>Брондау</Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default Mentors;
