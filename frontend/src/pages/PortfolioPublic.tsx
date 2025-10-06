import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { Card } from '../components/Card';
import { BadgePill } from '../components/BadgePill';

const PortfolioPublic = () => {
  const { id } = useParams();
  const { data } = useQuery({
    queryKey: ['public-portfolio', id],
    queryFn: async () => {
      const res = await api.get(`/portfolio/public/${id}`);
      return res.data;
    }
  });

  return (
    <section style={{ display: 'grid', gap: '1.5rem', maxWidth: '720px', margin: '0 auto' }}>
      <h1>{data?.name}</h1>
      <Card title="Расталған бейдждер (Подтверждено)">
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {data?.badges?.map((badge: any) => (
            <BadgePill key={badge.id} label={`${badge.name} · ${badge.level}`} level={badge.level} />
          ))}
        </div>
      </Card>
      {data?.portfolioUrl && (
        <Card title="Мини-жоба">
          <a href={data.portfolioUrl} target="_blank" rel="noreferrer">
            {data.portfolioUrl}
          </a>
        </Card>
      )}
    </section>
  );
};

export default PortfolioPublic;
