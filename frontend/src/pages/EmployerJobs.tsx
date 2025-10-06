import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../api/client';
import Card from '../components/Card';
import Button from '../components/Button';
import Table from '../components/Table';
import { useToast } from '../utils/ToastContext';
import { useAuthStore } from '../store/auth';

interface Job {
  id: string;
  title: string;
  city: string;
  salaryMin?: number | null;
  salaryMax?: number | null;
  skillsRequired: string[];
  description: string;
  employer: { id: string };
}

interface Application {
  id: string;
  status: string;
  user: { name: string; email: string; region?: string | null };
  job: { title: string };
}

const fetchEmployerJobs = async () => {
  const { data } = await api.get<Job[]>('/jobs');
  return data;
};

const fetchApplications = async () => {
  const { data } = await api.get<Application[]>('/jobs/me/applications');
  return data;
};

const EmployerJobs = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  const { setToast } = useToast();
  const { data: jobs } = useQuery({ queryKey: ['jobs'], queryFn: fetchEmployerJobs });
  const { data: applications } = useQuery({ queryKey: ['applications'], queryFn: fetchApplications });
  const [form, setForm] = useState({ title: '', city: '', salaryMin: '', salaryMax: '', skillsRequired: '', description: '' });

  const submitJob = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await api.post('/jobs', {
        title: form.title,
        city: form.city,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        skillsRequired: form.skillsRequired.split(',').map((s) => s.trim()),
        description: form.description,
      });
      setToast({ message: 'Вакансия қосылды', type: 'success' });
      setForm({ title: '', city: '', salaryMin: '', salaryMax: '', skillsRequired: '', description: '' });
      queryClient.invalidateQueries({ queryKey: ['jobs'] });
    } catch (error) {
      setToast({ message: 'Қате орын алды', type: 'error' });
    }
  };

  const employerJobs = jobs?.filter((job) => job.employer.id === user?.id) ?? [];

  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2>Жұмыс беруші кабинеті</h2>
      <form onSubmit={submitJob} style={{ display: 'grid', gap: '0.75rem', maxWidth: '520px', marginBottom: '2rem' }}>
        <input placeholder="Лауазым" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Қала" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <input
            placeholder="Мин ₸"
            type="number"
            value={form.salaryMin}
            onChange={(e) => setForm({ ...form, salaryMin: e.target.value })}
          />
          <input
            placeholder="Макс ₸"
            type="number"
            value={form.salaryMax}
            onChange={(e) => setForm({ ...form, salaryMax: e.target.value })}
          />
        </div>
        <input
          placeholder="Дағдылар (үтір арқылы)"
          value={form.skillsRequired}
          onChange={(e) => setForm({ ...form, skillsRequired: e.target.value })}
          required
        />
        <textarea
          placeholder="Сипаттама"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          required
          rows={4}
        />
        <Button type="submit">Сақтау</Button>
      </form>

      <h3>Менің вакансияларым</h3>
      <div className="card-grid">
        {employerJobs.map((job) => (
          <Card key={job.id} title={`${job.title} — ${job.city}`}>
            <p>{job.description}</p>
            <p>Дағдылар: {job.skillsRequired.join(', ')}</p>
          </Card>
        ))}
      </div>

      <h3 style={{ marginTop: '2rem' }}>Кандидаттар</h3>
      {applications && applications.length > 0 ? (
        <Table
          columns={["Кандидат", "Email", "Өңір", "Вакансия", "Статус"]}
          rows={applications.map((app) => [
            app.user.name,
            app.user.email,
            app.user.region ?? '—',
            app.job.title,
            app.status,
          ])}
        />
      ) : (
        <p>Өтінімдер жоқ.</p>
      )}
    </section>
  );
};

export default EmployerJobs;
