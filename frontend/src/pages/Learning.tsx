import { useQuery } from '@tanstack/react-query';
import Card from '../components/Card';
import ProgressBar from '../components/ProgressBar';
import api from '../api/client';

interface Enrollment {
  id: string;
  progress: number;
  course: {
    id: string;
    title: string;
    summary: string;
    lessons: { id: string; title: string; order: number }[];
  };
}

const fetchEnrollments = async () => {
  const { data } = await api.get<Enrollment[]>('/users/me/enrollments');
  return data;
};

const Learning = () => {
  const { data, isLoading } = useQuery({ queryKey: ['enrollments'], queryFn: fetchEnrollments });

  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <h2>Менің оқу кабинетом (Моё обучение)</h2>
      {isLoading ? (
        <p>Жүктелуде...</p>
      ) : (
        <div className="card-grid">
          {data?.map((enrollment) => (
            <Card key={enrollment.id} title={enrollment.course.title} subtitle={`Сабақтар: ${enrollment.course.lessons.length}`}>
              <p>{enrollment.course.summary}</p>
              <ProgressBar value={enrollment.progress} label="Прогресс" />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <a className="btn btn-primary" href={`/course/${enrollment.course.id}`}>
                  Сабақтарға өту
                </a>
                <a className="btn btn-secondary" href={`/quiz/${enrollment.course.id}`}>
                  Квиз
                </a>
              </div>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default Learning;
