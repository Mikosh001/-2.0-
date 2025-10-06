import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import QRCode from 'qrcode';
import Card from '../components/Card';
import BadgePill from '../components/BadgePill';
import api from '../api/client';
import { useAuthStore } from '../store/auth';

interface Badge {
  id: string;
  name: string;
  skillTag: string;
  level: string;
  qrCodeUrl?: string | null;
}

interface Profile {
  id: string;
  name: string;
  region?: string | null;
}

interface SimResult {
  speed: number;
  altitude: number;
  swath: number;
  coverageMinutes: number;
  overlapError: number;
  pass: boolean;
}

const fetchBadges = async () => {
  const { data } = await api.get<Badge[]>('/badges/me');
  return data;
};

const fetchProfile = async () => {
  const { data } = await api.get<Profile>('/users/me');
  return data;
};

const Portfolio = () => {
  const { user } = useAuthStore();
  const { data: badges } = useQuery({ queryKey: ['badges'], queryFn: fetchBadges });
  const { data: profile } = useQuery({ queryKey: ['profile'], queryFn: fetchProfile });
  const [projectUrl, setProjectUrl] = useState('');
  const [qrData, setQrData] = useState<string | null>(null);
  const [simHistory, setSimHistory] = useState<SimResult[]>([]);

  useEffect(() => {
    const history = localStorage.getItem('professiya-sim');
    if (history) {
      setSimHistory(JSON.parse(history));
    }
  }, []);

  useEffect(() => {
    const generateQr = async () => {
      if (!user) return;
      const url = `${window.location.origin}/u/${user.id}`;
      const dataUrl = await QRCode.toDataURL(url);
      setQrData(dataUrl);
    };
    generateQr();
  }, [user]);

  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2>Портфолио</h2>
      <div className="card-grid">
        <Card title="Профиль">
          <p>Аты: {profile?.name}</p>
          <p>Өңір: {profile?.region ?? '—'}</p>
          {qrData && <img src={qrData} alt="QR" style={{ width: '160px' }} />}
        </Card>
        <Card title="Бейдждер">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {badges?.map((badge) => (
              <div key={badge.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <strong>{badge.name}</strong>
                  <p style={{ margin: 0, color: '#475569' }}>{badge.skillTag}</p>
                </div>
                <BadgePill color={badge.level === 'Advanced' ? 'gold' : 'green'} label={badge.level} />
              </div>
            ))}
            {badges?.length === 0 && <p>Бейдж әлі жоқ.</p>}
          </div>
        </Card>
        <Card title="Мини-жоба">
          <label>
            Сілтеме немесе медиа URL
            <input
              type="url"
              value={projectUrl}
              onChange={(e) => setProjectUrl(e.target.value)}
              placeholder="https://"
            />
          </label>
          {projectUrl && (
            <a href={projectUrl} target="_blank" rel="noreferrer" style={{ color: '#007bff', fontWeight: 600 }}>
              Жобаны ашу
            </a>
          )}
        </Card>
        <Card title="Симулятор нәтижелері">
          {simHistory.length === 0 ? (
            <p>Әзірге дерек жоқ. Симуляторды аяқтаңыз.</p>
          ) : (
            <ul style={{ paddingLeft: '1rem' }}>
              {simHistory.map((item, idx) => (
                <li key={idx}>
                  {item.coverageMinutes} мин | қателік {item.overlapError}% | {item.pass ? 'Pass' : 'Fail'}
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </section>
  );
};

export default Portfolio;
