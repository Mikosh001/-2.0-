import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
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
  applications: { id: string; status: string; userId: string }[];
}

const EmployerJobs = () => {
  const queryClient = useQueryClient();
  const { notify } = useToast();
  const { data } = useQuery<Job[]>({
    queryKey: ['jobs', 'employer'],
    queryFn: async () => {
      const res = await api.get('/jobs', { params: { mine: true } });
      return res.data;
    }
  });

  const [form, setForm] = useState({
    title: '',
    city: '',
    salaryMin: '',
    salaryMax: '',
    skillsRequired: '',
    description: ''
  });

  const mutation = useMutation({
    mutationFn: async () => {
      await api.post('/jobs', {
        ...form,
        salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
        skillsRequired: form.skillsRequired.split(',').map((s) => s.trim())
      });
    },
    onSuccess: () => {
      notify('Вакансия сақталды (Сохранено)');
      queryClient.invalidateQueries({ queryKey: ['jobs', 'employer'] });
    }
  });

  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      <h1>Жұмыс басқару (Управление вакансиями)</h1>
      <Card title="Жаңа вакансия (Новая)">
        {Object.entries(form).map(([key, value]) => (
          <label key={key}>
            {key}
            <input value={value} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
          </label>
        ))}
        <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
          Жариялау (Опубликовать)
        </Button>
      </Card>
      <div style={{ display: 'grid', gap: '1rem' }}>
        {data?.map((job) => (
          <Card key={job.id} title={`${job.title} · ${job.city}`} subtitle={`Өтінімдер: ${job.applications.length}`}>
            <p>{job.description}</p>
            <p>Дағдылар: {job.skillsRequired.join(', ')}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default EmployerJobs;
