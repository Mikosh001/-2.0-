import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import api from '../api/client';
import Card from '../components/Card';
import BadgePill from '../components/BadgePill';
import Button from '../components/Button';

interface Lesson {
  id: string;
  title: string;
  type: string;
  order: number;
  contentMd?: string | null;
  videoUrl?: string | null;
}

interface Course {
  id: string;
  title: string;
  summary: string;
  skills: string[];
  lessons: Lesson[];
}

const fetchCourse = async (id: string) => {
  const { data } = await api.get<Course>(`/courses/${id}`);
  return data;
};

const CourseDetail = () => {
  const { id } = useParams();
  const { data, isLoading } = useQuery({ queryKey: ['course', id], queryFn: () => fetchCourse(id!), enabled: Boolean(id) });

  if (isLoading) return <p style={{ padding: '2rem' }}>Жүктелуде...</p>;
  if (!data) return <p style={{ padding: '2rem' }}>Курс табылмады</p>;

  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h2>{data.title}</h2>
        <p>{data.summary}</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {data.skills.map((skill) => (
            <BadgePill key={skill} label={skill} />
          ))}
        </div>
      </header>
      <div className="card-grid">
        {data.lessons
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((lesson) => (
            <Card key={lesson.id} title={`${lesson.order}. ${lesson.title}`} subtitle={`Тип: ${lesson.type}`}>
              {lesson.videoUrl && (
                <a href={lesson.videoUrl} target="_blank" rel="noreferrer" style={{ color: '#007bff', fontWeight: 600 }}>
                  Видео көру
                </a>
              )}
              {lesson.contentMd && <p>{lesson.contentMd}</p>}
              <Button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Сабақты белгілеу</Button>
            </Card>
          ))}
      </div>
    </section>
  );
};

export default CourseDetail;
