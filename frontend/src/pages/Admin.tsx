import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import api from '../api/client';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { useToast } from '../components/Toast';

const Admin = () => {
  const { notify } = useToast();
  const [coursePayload, setCoursePayload] = useState({
    title: '',
    slug: '',
    summary: '',
    skills: '',
    durationWeeks: 4
  });
  const [questionPayload, setQuestionPayload] = useState({
    quizId: '',
    text: '',
    skillTag: '',
    difficulty: 1,
    options: '[{"text":"Опция","isCorrect":true}]'
  });

  const courseMutation = useMutation({
    mutationFn: async () => {
      await api.post('/courses', {
        ...coursePayload,
        durationWeeks: Number(coursePayload.durationWeeks),
        skills: coursePayload.skills.split(',').map((s) => s.trim())
      });
    },
    onSuccess: () => notify('Курс қосылды (Добавлен)')
  });

  const questionMutation = useMutation({
    mutationFn: async () => {
      await api.post('/admin/questions', {
        ...questionPayload,
        difficulty: Number(questionPayload.difficulty),
        options: JSON.parse(questionPayload.options)
      });
    },
    onSuccess: () => notify('Сұрақ сақталды (Сохранено)')
  });

  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      <h1>Админ панелі (Админ)</h1>
      <Card title="Курс құру (Создать курс)">
        {Object.entries(coursePayload).map(([key, value]) => (
          <label key={key}>
            {key}
            <input value={value} onChange={(e) => setCoursePayload({ ...coursePayload, [key]: e.target.value })} />
          </label>
        ))}
        <Button onClick={() => courseMutation.mutate()} disabled={courseMutation.isPending}>
          Сақтау
        </Button>
      </Card>
      <Card title="Сұрақ қосу (Добавить вопрос)">
        {Object.entries(questionPayload).map(([key, value]) => (
          <label key={key}>
            {key}
            <input value={value} onChange={(e) => setQuestionPayload({ ...questionPayload, [key]: e.target.value })} />
          </label>
        ))}
        <Button onClick={() => questionMutation.mutate()} disabled={questionMutation.isPending}>
          Сақтау
        </Button>
      </Card>
    </section>
  );
};

export default Admin;
