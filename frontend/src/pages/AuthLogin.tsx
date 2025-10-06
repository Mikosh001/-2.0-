import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/client';
import Button from '../components/Button';
import Card from '../components/Card';
import { kk } from '../i18n/kk';
import { useAuthStore } from '../store/auth';
import { useToast } from '../utils/ToastContext';

const AuthLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { setToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/auth/login', { email, password });
      setAuth({ token: data.token, user: data.user });
      setToast({ message: 'Қош келдіңіз!', type: 'success' });
      navigate('/learning');
    } catch (error) {
      setToast({ message: 'Кіру сәтсіз', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container" style={{ padding: '2rem 0', maxWidth: '480px' }}>
      <Card title="Кіру (Login)">
        <form onSubmit={submit} style={{ display: 'grid', gap: '0.75rem' }}>
          <label>
            {kk.auth.email}
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </label>
          <label>
            {kk.auth.password}
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </label>
          <Button type="submit" disabled={loading}>
            {kk.auth.submitLogin}
          </Button>
        </form>
        <p style={{ marginTop: '1rem' }}>
          Әлі аккаунт жоқ па? <Link to="/auth/register">{kk.nav.register}</Link>
        </p>
      </Card>
    </section>
  );
};

export default AuthLogin;
