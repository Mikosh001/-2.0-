import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../api/client';
import Card from '../components/Card';
import BadgePill from '../components/BadgePill';
import Button from '../components/Button';
import { useToast } from '../utils/ToastContext';
import { kk } from '../i18n/kk';

interface Job {
  id: string;
  title: string;
  city: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  skillsRequired: string[];
  description: string;
  matchScore?: number;
  matchReason?: string[];
}

const fetchJobs = async (filters: { city?: string; skills?: string }) => {
  const { data } = await api.get<Job[]>('/jobs', { params: filters });
  return data;
};

const fetchMatches = async () => {
  const { data } = await api.get<Job[]>('/jobs', { params: { matchFor: 'me' } });
  return data;
};

const Jobs = () => {
  const [city, setCity] = useState('');
  const [skills, setSkills] = useState('');
  const queryClient = useQueryClient();
  const { setToast } = useToast();
  const { data, refetch } = useQuery({ queryKey: ['jobs', city, skills], queryFn: () => fetchJobs({ city, skills }) });
  const { data: matches } = useQuery({ queryKey: ['job-matches'], queryFn: fetchMatches });

  const apply = async (jobId: string) => {
    try {
      await api.post(`/jobs/${jobId}/apply`);
      setToast({ message: 'Өтінім жіберілді!', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    } catch (error) {
      setToast({ message: 'Өтінім қате', type: 'error' });
    }
  };

  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2>Жұмыс ұсыныстары</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          refetch();
        }}
        style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', margin: '1rem 0' }}
      >
        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Қала"
          style={{ padding: '0.65rem 1rem', borderRadius: '999px', border: '1px solid rgba(15,23,42,0.15)' }}
        />
        <input
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          placeholder="Дағдылар (мыс. UAV,LoRa)"
          style={{ padding: '0.65rem 1rem', borderRadius: '999px', border: '1px solid rgba(15,23,42,0.15)' }}
        />
        <Button type="submit">Сүзу</Button>
      </form>
      <div className="card-grid">
        {matches && matches.length > 0 && (
          <Card title={kk.jobs.matchTitle}>
            {matches.slice(0, 3).map((job) => (
              <div key={job.id} style={{ marginBottom: '1rem' }}>
                <strong>{job.title}</strong>
                <p style={{ margin: 0 }}>Сәйкестік: {(((job.matchScore ?? 0) * 100) || 0).toFixed(0)}%</p>
                <p style={{ margin: 0 }}>Дағдылар: {job.matchReason?.join(', ')}</p>
              </div>
            ))}
          </Card>
        )}
        {data?.map((job) => (
          <Card key={job.id} title={`${job.title} — ${job.city}`} subtitle={job.description}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {job.skillsRequired.map((skill) => (
                <BadgePill key={skill} label={skill} color="green" />
              ))}
            </div>
            <p>
              Жалақы: {job.salaryMin ? job.salaryMin.toLocaleString('kk-KZ') : '—'} -{' '}
              {job.salaryMax ? job.salaryMax.toLocaleString('kk-KZ') : '—'} ₸
            </p>
            <Button onClick={() => apply(job.id)}>Өтінім жіберу</Button>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Jobs;
