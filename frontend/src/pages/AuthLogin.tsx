import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Button } from '../components/Button';
import { useUI } from '../store/ui';

interface LoginForm {
  email: string;
  password: string;
}

const AuthLogin = () => {
  const { register, handleSubmit } = useForm<LoginForm>();
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const { showToast } = useUI();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values);
      showToast('Қош келдіңіз! (Добро пожаловать)');
      navigate('/learning');
    } catch (err) {
      showToast('Қате деректер (Неверные данные)');
    }
  });

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Кіру (Вход)</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input {...register('email')} type="email" className="rounded-lg border border-slate-200 px-3 py-2" required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Құпия сөз (Пароль)
          <input
            {...register('password')}
            type="password"
            className="rounded-lg border border-slate-200 px-3 py-2"
            required
          />
        </label>
        <Button type="submit" className="w-full">
          Кіру (Войти)
        </Button>
        <p className="text-center text-sm text-slate-500">
          Аккаунт жоқ па? <Link to="/auth/register" className="text-primary">Тіркелу</Link>
        </p>
      </form>
    </section>
  );
};

export default AuthLogin;
