import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
import BadgePill from '../components/BadgePill';
import api from '../api/client';
import { useToast } from '../utils/ToastContext';

interface Course {
  id: string;
  title: string;
  summary: string;
  skills: string[];
  durationWeeks: number;
}

const fetchCourses = async (skill?: string) => {
  const params = skill ? { skill } : undefined;
  const { data } = await api.get<Course[]>('/courses', { params });
  return data;
};

const Professions = () => {
  const [skillFilter, setSkillFilter] = useState('');
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['courses', skillFilter],
    queryFn: () => fetchCourses(skillFilter || undefined),
  });
  const { setToast } = useToast();

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setToast({ message: 'Фильтр жаңартылды (Фильтр обновлён)', type: 'success' });
    refetch();
  };

  return (
    <section className="container" style={{ padding: '2rem 0' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <h2>Кәсіптер тізімі (Список профессий)</h2>
        <p>AgriTech бағыттарындағы заманауи курстар.</p>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          <input
            value={skillFilter}
            onChange={(e) => setSkillFilter(e.target.value)}
            placeholder="Дағдылар бойынша іздеу (Поиск по навыкам)"
            style={{ padding: '0.65rem 1rem', borderRadius: '999px', border: '1px solid rgba(15,23,42,0.15)', flex: '1' }}
            aria-label="Skill filter"
          />
          <Button type="submit">Іздеу (Поиск)</Button>
        </form>
      </header>
      {isLoading ? (
        <p>Жүктелуде...</p>
      ) : (
        <div className="card-grid">
          {data?.map((course) => (
            <Card key={course.id} title={course.title} subtitle={`${course.durationWeeks} апта`}>
              <p>{course.summary}</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {course.skills.map((skill) => (
                  <BadgePill key={skill} label={skill} color="blue" />
                ))}
              </div>
              <a className="btn btn-primary" href={`/course/${course.id}`}>
                Курсты көру (Подробнее)
              </a>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
};

export default Professions;
