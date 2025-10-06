import { useState } from 'react';
import api from '../api/client';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuthStore } from '../store/auth';
import { useNavigate, Link } from 'react-router-dom';

const AuthLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuthStore();
  const navigate = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/auth/login', { email, password });
    login(res.data);
    navigate('/');
  };

  return (
    <section style={{ display: 'grid', placeItems: 'center', minHeight: '70vh' }}>
      <Card title="Кіру (Войти)">
        <form onSubmit={submit} style={{ display: 'grid', gap: '0.75rem' }}>
          <label>
            Email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            Құпия сөз (Пароль)
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <Button type="submit">Кіру (Войти)</Button>
        </form>
        <p>
          Аккаунт жоқ па? <Link to="/auth/register">Тіркелу (Регистрация)</Link>
        </p>
      </Card>
    </section>
  );
};

export default AuthLogin;
