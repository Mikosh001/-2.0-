import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import Card from '../components/Card';
import BadgePill from '../components/BadgePill';

interface PublicBadge {
  id: string;
  name: string;
  skillTag: string;
  level: string;
}

interface PublicProfileData {
  id: string;
  name: string;
  region?: string | null;
  badges: PublicBadge[];
}

const fetchPublicProfile = async (id: string) => {
  const { data } = await api.get<PublicProfileData>(`/users/${id}/public`);
  return data;
};

const PublicProfile = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({
    queryKey: ['public-profile', id],
    queryFn: () => fetchPublicProfile(id!),
    enabled: Boolean(id),
  });

  if (isLoading) return <p style={{ padding: '2rem' }}>Жүктелуде...</p>;
  if (!data) return <p style={{ padding: '2rem' }}>Профиль табылмады</p>;

  return (
    <section className="container" style={{ padding: '2rem 0', maxWidth: '640px' }}>
      <Card title={data.name} subtitle={data.region ?? 'Қазақстан'}>
        <h4>Верификацияланған бейдждер</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.badges.map((badge) => (
            <div key={badge.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{badge.name}</strong>
                <p style={{ margin: 0, color: '#475569' }}>{badge.skillTag}</p>
              </div>
              <BadgePill color={badge.level === 'Advanced' ? 'gold' : 'green'} label={badge.level} />
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
};

export default PublicProfile;
