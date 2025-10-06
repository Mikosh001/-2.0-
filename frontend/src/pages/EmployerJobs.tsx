import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../api/client';
import { useAuthStore } from '../store/auth';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { useUI } from '../store/ui';

const EmployerJobs = () => {
  const { token } = useAuthStore();
  const { showToast } = useUI();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    title: '',
    city: '',
    salaryMin: '',
    salaryMax: '',
    skills: '',
    description: '',
  });

  const { data: jobs } = useQuery({
    queryKey: ['employer-jobs'],
    queryFn: () => api.get('/jobs/employer/manage', token),
    enabled: Boolean(token),
  });

  const createJob = useMutation({
    mutationFn: () =>
      api.post(
        '/jobs',
        {
          title: form.title,
          city: form.city,
          salaryMin: form.salaryMin ? Number(form.salaryMin) : undefined,
          salaryMax: form.salaryMax ? Number(form.salaryMax) : undefined,
          skillsRequired: form.skills.split(',').map((s) => s.trim()),
          description: form.description,
        },
        token
      ),
    onSuccess: () => {
      showToast('Вакансия қосылды (Добавлено)');
      queryClient.invalidateQueries({ queryKey: ['employer-jobs'] });
      setForm({ title: '', city: '', salaryMin: '', salaryMax: '', skills: '', description: '' });
    },
    onError: () => showToast('Қате болды (Ошибка)'),
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Жұмыс беруші кабинеті</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-primary">Жаңа вакансия</h2>
          {['title', 'city', 'salaryMin', 'salaryMax', 'skills'].map((field) => (
            <label key={field} className="flex flex-col gap-1 text-sm">
              {field === 'skills' ? 'Дағдылар (через запятую)' : field}
              <input
                value={(form as any)[field]}
                onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
          ))}
          <label className="flex flex-col gap-1 text-sm">
            Сипаттама (Описание)
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              className="rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <Button onClick={() => createJob.mutate()} disabled={createJob.isPending}>
            Сақтау (Сохранить)
          </Button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-800">Өтінімдер</h2>
          <Table
            headers={["Вакансия", "Үміткер", "Статус"]}
            rows={
              jobs?.flatMap((job: any) =>
                job.applications.map((app: any) => [job.title, app.user.name, app.status])
              ) || []
            }
          />
        </div>
      </div>
    </section>
  );
};

export default EmployerJobs;
