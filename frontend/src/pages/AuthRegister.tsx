import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore, UserRole } from '../store/auth';
import { Button } from '../components/Button';
import { useUI } from '../store/ui';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  region: string;
}

const AuthRegister = () => {
  const { register: registerField, handleSubmit } = useForm<RegisterForm>({
    defaultValues: { role: 'student' },
  });
  const { register: registerUser } = useAuthStore();
  const navigate = useNavigate();
  const { showToast } = useUI();

  const onSubmit = handleSubmit(async (values) => {
    try {
      await registerUser(values);
      showToast('Тіркелу сәтті! (Успешно)');
      navigate('/learning');
    } catch (err) {
      showToast('Қате немесе email қолданыста');
    }
  });

  return (
    <section className="mx-auto max-w-md px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Тіркелу (Регистрация)</h1>
      <form onSubmit={onSubmit} className="mt-8 space-y-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="flex flex-col gap-1 text-sm">
          Аты-жөні
          <input {...registerField('name')} className="rounded-lg border border-slate-200 px-3 py-2" required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Email
          <input {...registerField('email')} type="email" className="rounded-lg border border-slate-200 px-3 py-2" required />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Құпия сөз (Пароль)
          <input
            {...registerField('password')}
            type="password"
            className="rounded-lg border border-slate-200 px-3 py-2"
            required
          />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Аймақ (Регион)
          <input {...registerField('region')} className="rounded-lg border border-slate-200 px-3 py-2" />
        </label>
        <label className="flex flex-col gap-1 text-sm">
          Роль
          <select {...registerField('role')} className="rounded-lg border border-slate-200 px-3 py-2">
            <option value="student">Студент</option>
            <option value="employer">Жұмыс беруші</option>
          </select>
        </label>
        <Button type="submit" className="w-full">
          Тіркелу (Регистрация)
        </Button>
        <p className="text-center text-sm text-slate-500">
          Аккаунт бар ма? <Link to="/auth/login" className="text-primary">Кіру</Link>
        </p>
      </form>
    </section>
  );
};

export default AuthRegister;
