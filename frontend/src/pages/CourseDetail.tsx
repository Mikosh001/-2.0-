import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import { Card } from '../components/Card';
import { Button } from '../components/Button';

interface Lesson {
  id: string;
  title: string;
  type: 'video' | 'task' | 'sim';
  videoUrl?: string;
  contentMd?: string;
}

interface Course {
  id: string;
  title: string;
  summary: string;
  skills: string[];
}

const CourseDetail = () => {
  const { id } = useParams();
  const { data: course } = useQuery<Course>({
    queryKey: ['course', id],
    queryFn: async () => {
      const res = await api.get(`/courses/${id}`);
      return res.data;
    }
  });

  const { data: lessons } = useQuery<Lesson[]>({
    queryKey: ['lessons', id],
    queryFn: async () => {
      const res = await api.get(`/courses/${id}/lessons`);
      return res.data;
    }
  });

  return (
    <section style={{ display: 'grid', gap: '1.5rem' }}>
      <h1>{course?.title}</h1>
      <p>{course?.summary}</p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {course?.skills.map((skill) => (
          <span key={skill} style={{ background: '#fff2d4', padding: '0.35rem 0.85rem', borderRadius: '999px' }}>
            {skill}
          </span>
        ))}
      </div>
      <Card title="Сабақтар (Уроки)">
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {lessons?.map((lesson) => (
            <div key={lesson.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{lesson.title}</strong>
                <p style={{ margin: 0, color: 'rgba(36,50,75,0.7)' }}>{lesson.type}</p>
              </div>
              {lesson.videoUrl && (
                <a href={lesson.videoUrl} target="_blank" rel="noreferrer" style={{ color: '#007bff' }}>
                  Видео
                </a>
              )}
            </div>
          ))}
        </div>
      </Card>
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Button onClick={() => (window.location.href = `/quiz/${course?.id}`)}>Тестке өту (Пройти тест)</Button>
        <Link to="/sim" style={{ color: '#4caf50', fontWeight: 600 }}>
          Симуляторға өту (Перейти)
        </Link>
      </div>
    </section>
  );
};

export default CourseDetail;
