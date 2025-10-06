import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import Button from '../components/Button';
import Card from '../components/Card';
import { kk } from '../i18n/kk';
import { useAuthStore } from '../store/auth';
import { useToast } from '../utils/ToastContext';

const AuthRegister = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { setToast } = useToast();
  const [form, setForm] = useState({ name: '', email: '', password: '', region: '', role: 'student' });
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/register', form);
      setAuth({ token: data.token, user: data.user });
      setToast({ message: 'Тіркелу сәтті өтті', type: 'success' });
      navigate('/learning');
    } catch (error) {
      setToast({ message: 'Тіркелу қате', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container" style={{ padding: '2rem 0', maxWidth: '520px' }}>
      <Card title="Тіркелу (Register)">
        <form onSubmit={submit} style={{ display: 'grid', gap: '0.75rem' }}>
          <label>
            {kk.auth.name}
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          </label>
          <label>
            {kk.auth.email}
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </label>
          <label>
            {kk.auth.password}
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </label>
          <label>
            {kk.auth.region}
            <input value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} />
          </label>
          <label>
            Рөлі (Роль)
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              <option value="student">Студент</option>
              <option value="employer">Жұмыс беруші</option>
            </select>
          </label>
          <Button type="submit" disabled={loading}>
            {kk.auth.submitRegister}
          </Button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          Аккаунт бар ма? <Link to="/auth/login">{kk.nav.login}</Link>
        </p>
      </Card>
    </section>
  );
};

export default AuthRegister;
