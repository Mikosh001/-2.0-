import { useState } from 'react';
import api from '../api/client';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuthStore } from '../store/auth';
import { useNavigate, Link } from 'react-router-dom';

const AuthRegister = () => {
  const [form, setForm] = useState({ email: '', password: '', name: '', role: 'student', region: '' });
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/auth/register', form);
    login(res.data);
    navigate('/');
  };

  return (
    <section style={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
      <Card title="Тіркелу (Регистрация)">
        <form onSubmit={submit} style={{ display: 'grid', gap: '0.75rem' }}>
          {Object.entries(form).map(([key, value]) => (
            <label key={key}>
              {key}
              {key === 'role' ? (
                <select value={value} onChange={(e) => setForm({ ...form, [key]: e.target.value })}>
                  <option value="student">Студент</option>
                  <option value="employer">Жұмыс беруші</option>
                </select>
              ) : (
                <input
                  type={key === 'password' ? 'password' : 'text'}
                  value={value}
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  required={key !== 'region'}
                />
              )}
            </label>
          ))}
          <Button type="submit">Қосу (Создать)</Button>
        </form>
        <p>
          Бар аккаунт? <Link to="/auth/login">Кіру</Link>
        </p>
      </Card>
    </section>
  );
};

export default AuthRegister;
