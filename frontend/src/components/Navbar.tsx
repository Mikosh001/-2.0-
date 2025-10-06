import { Link, NavLink } from 'react-router-dom';
import './Navbar.css';
import { useAuthStore } from '../store/auth';
import { Button } from './Button';

const navItems = [
  { to: '/', label: 'Басты бет', subtitle: 'Главная' },
  { to: '/professions', label: 'Кәсіптер', subtitle: 'Профессии' },
  { to: '/stories', label: 'Табыстар', subtitle: 'Истории' },
  { to: '/blog', label: 'Блог', subtitle: 'Блог' }
];

export const Navbar = () => {
  const { user, logout } = useAuthStore();
  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo" aria-label="Профессия 2.0">
        Профессия 2.0
      </Link>
      <nav>
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
            <span>{item.label}</span>
            <small>{item.subtitle}</small>
          </NavLink>
        ))}
      </nav>
      <div className="navbar-actions">
        {user ? (
          <>
            <span className="navbar-user">{user.name}</span>
            <Button variant="secondary" onClick={logout}>
              Шығу <small>(Выйти)</small>
            </Button>
          </>
        ) : (
          <Link to="/auth/login" className="navbar-login">
            Кіру <small>(Войти)</small>
          </Link>
        )}
      </div>
    </header>
  );
};
