import { Link, NavLink } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { Button } from './Button';

const navItems = [
  { to: '/', label: 'Басты бет' },
  { to: '/professions', label: 'Кәсіптер' },
  { to: '/stories', label: 'Тәжірибе' },
  { to: '/blog', label: 'Блог' },
  { to: '/mentors', label: 'Тәлімгерлер' },
];

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  return (
    <header className="bg-white border-b border-slate-200">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link to="/" className="text-xl font-bold text-primary">
          Профессия 2.0
        </Link>
        <nav className="hidden gap-6 text-sm font-medium md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `hover:text-primary ${isActive ? 'text-primary underline decoration-accent' : 'text-slate-600'}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-slate-600">{user.name}</span>
              <Button variant="ghost" onClick={logout}>
                Шығу (Выйти)
              </Button>
            </>
          ) : (
            <Link
              to="/auth/login"
              className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              Кіру (Войти)
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};
