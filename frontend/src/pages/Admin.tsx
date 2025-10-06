import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { api } from '../api/client';
import { useAuthStore } from '../store/auth';
import { Button } from '../components/Button';
import { Table } from '../components/Table';
import { useUI } from '../store/ui';

const Admin = () => {
  const { token } = useAuthStore();
  const { showToast } = useUI();
  const queryClient = useQueryClient();
  const [courseForm, setCourseForm] = useState({
    title: '',
    slug: '',
    summary: '',
    skills: '',
    durationWeeks: 4,
  });

  const { data: courses } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => api.get('/admin/courses', token),
    enabled: Boolean(token),
  });

  const createCourse = useMutation({
    mutationFn: () =>
      api.post(
        '/admin/courses',
        {
          title: courseForm.title,
          slug: courseForm.slug,
          summary: courseForm.summary,
          skills: courseForm.skills.split(',').map((s) => s.trim()),
          durationWeeks: courseForm.durationWeeks,
        },
        token
      ),
    onSuccess: () => {
      showToast('Курс қосылды (Добавлено)');
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
      setCourseForm({ title: '', slug: '', summary: '', skills: '', durationWeeks: 4 });
    },
    onError: () => showToast('Қате болды'),
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Админ панелі</h1>
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-primary">Курс қосу</h2>
          {['title', 'slug', 'summary', 'skills'].map((field) => (
            <label key={field} className="flex flex-col gap-1 text-sm">
              {field}
              <input
                value={(courseForm as any)[field]}
                onChange={(e) => setCourseForm((prev) => ({ ...prev, [field]: e.target.value }))}
                className="rounded-lg border border-slate-200 px-3 py-2"
              />
            </label>
          ))}
          <label className="flex flex-col gap-1 text-sm">
            durationWeeks
            <input
              type="number"
              value={courseForm.durationWeeks}
              onChange={(e) => setCourseForm((prev) => ({ ...prev, durationWeeks: Number(e.target.value) }))}
              className="rounded-lg border border-slate-200 px-3 py-2"
            />
          </label>
          <Button onClick={() => createCourse.mutate()} disabled={createCourse.isPending}>
            Сақтау
          </Button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-semibold text-slate-800">Курстар</h2>
          <Table
            headers={["Атауы", "Slug", "Ұзақтығы"]}
            rows={courses?.map((course: any) => [course.title, course.slug, `${course.durationWeeks} апта`]) || []}
          />
        </div>
      </div>
    </section>
  );
};

export default Admin;
