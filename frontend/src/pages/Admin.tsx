import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import api from '../api/client';
import Button from '../components/Button';
import Table from '../components/Table';
import { useToast } from '../utils/ToastContext';

interface Course {
  id: string;
  title: string;
  slug: string;
  summary: string;
  skills: string[];
}

const fetchAdminCourses = async () => {
  const { data } = await api.get<Course[]>('/admin/courses');
  return data;
};

const AdminDashboard = () => {
  const queryClient = useQueryClient();
  const { setToast } = useToast();
  const { data: courses } = useQuery({ queryKey: ['admin-courses'], queryFn: fetchAdminCourses });
  const [form, setForm] = useState({ title: '', slug: '', summary: '', skills: '' });

  const createCourse = useMutation({
    mutationFn: async () =>
      api.post('/admin/courses', {
        title: form.title,
        slug: form.slug,
        summary: form.summary,
        skills: form.skills.split(',').map((s) => s.trim()),
      }),
    onSuccess: () => {
      setToast({ message: 'Курс қосылды', type: 'success' });
      setForm({ title: '', slug: '', summary: '', skills: '' });
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
    },
    onError: () => setToast({ message: 'Қате', type: 'error' }),
  });

  const deleteCourse = useMutation({
    mutationFn: (id: string) => api.delete(`/admin/courses/${id}`),
    onSuccess: () => {
      setToast({ message: 'Курс жойылды', type: 'success' });
      queryClient.invalidateQueries({ queryKey: ['admin-courses'] });
    },
  });

  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2>Admin панелі</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createCourse.mutate();
        }}
        style={{ display: 'grid', gap: '0.75rem', maxWidth: '520px', marginBottom: '2rem' }}
      >
        <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Slug" value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} required />
        <textarea
          placeholder="Summary"
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          rows={3}
          required
        />
        <input
          placeholder="Skills (comma separated)"
          value={form.skills}
          onChange={(e) => setForm({ ...form, skills: e.target.value })}
          required
        />
        <Button type="submit" disabled={createCourse.isPending}>
          Қосу
        </Button>
      </form>

      <Table
        columns={['Курс', 'Slug', 'Skills', 'Әрекет']}
        rows={
          courses?.map((course) => [
            course.title,
            course.slug,
            course.skills.join(', '),
            <Button key={course.id} variant="ghost" onClick={() => deleteCourse.mutate(course.id)}>
              Жою
            </Button>,
          ]) ?? []
        }
      />
    </section>
  );
};

export default AdminDashboard;
