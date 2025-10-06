import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import { Card } from '../components/Card';
import { BadgePill } from '../components/BadgePill';
import { Button } from '../components/Button';
import { useEffect, useState } from 'react';
import { useToast } from '../components/Toast';
import { useAuthStore } from '../store/auth';

const Portfolio = () => {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { user } = useAuthStore();
  const { data } = useQuery({
    queryKey: ['portfolio'],
    queryFn: async () => {
      const res = await api.get('/portfolio/me');
      return res.data;
    }
  });
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [simResult, setSimResult] = useState<{ coverageTime: number; overlap: number; status: string } | null>(null);

  useEffect(() => {
    if (data?.portfolioUrl) {
      setPortfolioUrl(data.portfolioUrl);
    }
  }, [data?.portfolioUrl]);

  useEffect(() => {
    const stored = localStorage.getItem('simResult');
    if (stored) {
      setSimResult(JSON.parse(stored));
    }
  }, []);

  const mutation = useMutation({
    mutationFn: async () => {
      await api.put('/portfolio/me', { portfolioUrl });
    },
    onSuccess: () => {
      notify('Портфолио жаңартылды (Обновлено)');
      queryClient.invalidateQueries({ queryKey: ['portfolio'] });
    }
  });

  const generateQr = async (badgeId: string) => {
    const res = await api.get(`/badges/${badgeId}/qrcode`);
    const link = document.createElement('a');
    link.href = res.data.url;
    link.download = 'badge-qr.png';
    link.click();
  };

  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      <h1>Портфолио (Портфолио)</h1>
      <Card title={`Аты-жөні: ${data?.name ?? ''}`} subtitle={`Аймақ: ${data?.region ?? '—'}`}>
        <p>Қоғамдық сілтеме: {`${window.location.origin}/u/${user?.id}`}</p>
        <label>
          Мини-жоба немесе медиа URL
          <input
            value={portfolioUrl}
            onChange={(e) => setPortfolioUrl(e.target.value)}
            placeholder="https://..."
          />
        </label>
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          Сақтау (Сохранить)
        </Button>
      </Card>
      <Card title="Бейдждер (Бейджи)">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          {data?.badges?.map((badge: any) => (
            <div key={badge.id} style={{ display: 'grid', gap: '0.35rem' }}>
              <BadgePill label={`${badge.name} · ${badge.level}`} level={badge.level} />
              <Button variant="secondary" onClick={() => generateQr(badge.id)}>
                QR алу (Получить QR)
              </Button>
            </div>
          ))}
        </div>
      </Card>
      {simResult && (
        <Card title="Симулятор нәтижесі (Результат)">
          <p>Уақыты: {simResult.coverageTime.toFixed(1)} сек.</p>
          <p>Қабаттасу: {simResult.overlap.toFixed(1)}%</p>
          <p>Статус: {simResult.status}</p>
        </Card>
      )}
    </section>
  );
};

export default Portfolio;
