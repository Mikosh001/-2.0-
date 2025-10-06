import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuthStore } from '../store/auth';
import { BadgePill } from '../components/BadgePill';
import { Button } from '../components/Button';

interface PortfolioProps {
  isPublic?: boolean;
}

const Portfolio = ({ isPublic }: PortfolioProps) => {
  const { id } = useParams();
  const { user, token } = useAuthStore();
  const [projectLink, setProjectLink] = useState('');
  const [qr, setQr] = useState<string | null>(null);

  const profileId = isPublic ? id : user?.id;

  const { data: profile, refetch } = useQuery({
    queryKey: ['portfolio', profileId],
    queryFn: () => api.get(`/u/${profileId}`),
    enabled: Boolean(profileId),
  });

  useEffect(() => {
    if (!isPublic && profile?.badges?.length) {
      api.get(`/badge/${profile.badges[0].id}/qrcode`).then((data: any) => setQr(data.url));
    }
    if (!isPublic && profile?.portfolioUrl) {
      setProjectLink(profile.portfolioUrl);
    }
  }, [isPublic, profile]);

  if (!profile) return null;

  const shareUrl = `${window.location.origin}/u/${profile.id}`;

  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Портфолио (Портфолио)</h1>
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-semibold text-primary">{profile.name}</h2>
        {profile.region && <p className="text-sm text-slate-500">{profile.region}</p>}
        {profile.portfolioUrl && (
          <a
            href={profile.portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex text-sm font-semibold text-primary"
          >
            Мини-жоба көру (Открыть проект)
          </a>
        )}
        <div className="mt-4 flex flex-wrap gap-3">
          {profile.badges?.map((badge: any) => (
            <BadgePill key={badge.id} label={badge.name} level={badge.level} />
          ))}
        </div>
        {!isPublic && (
          <div className="mt-6 space-y-3 text-sm">
            <label className="flex flex-col gap-1">
              Мини-жоба сілтемесі (Ссылка на мини-проект)
              <input
                type="url"
                value={projectLink}
                onChange={(e) => setProjectLink(e.target.value)}
                className="rounded-lg border border-slate-200 px-3 py-2"
                placeholder="https://..."
              />
            </label>
            <p className="text-xs text-slate-500">Жүктеулер локалды түрде сақталады.</p>
            <Button
              onClick={async () => {
                await api.post('/me/portfolio', { portfolioUrl: projectLink }, token);
                await refetch();
                if (profile.badges?.[0]) {
                  const data = await api.get(`/badge/${profile.badges[0].id}/qrcode`);
                  setQr((data as any).url);
                }
              }}
            >
              Сақтау (Сохранить)
            </Button>
          </div>
        )}
        <div className="mt-6 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <p>Публичті сілтеме: {shareUrl}</p>
          {qr && (
            <img src={qr} alt="QR" className="mt-3 h-32 w-32" />
          )}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
