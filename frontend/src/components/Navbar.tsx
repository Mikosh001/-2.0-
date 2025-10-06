import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { kk } from '../i18n/kk';
import { useAuthStore } from '../store/auth';
import Button from './Button';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const [open, setOpen] = useState(false);

  const navItems = [
    { to: '/', label: kk.nav.home, protected: false },
    { to: '/professions', label: kk.nav.professions, protected: false },
    { to: '/stories', label: kk.nav.stories, protected: false },
    { to: '/blog', label: kk.nav.blog, protected: false },
  ];

  const studentItems = [
    { to: '/learning', label: kk.nav.learning },
    { to: '/jobs', label: kk.nav.jobs },
    { to: '/mentors', label: kk.nav.mentors },
    { to: '/portfolio', label: kk.nav.portfolio },
    { to: '/sim', label: kk.nav.sim },
  ];

  const employerItems = [{ to: '/employer/jobs', label: kk.nav.employer }];
  const adminItems = [{ to: '/admin', label: kk.nav.admin }];

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        <Link to="/" className="navbar-logo">
          Профессия 2.0
        </Link>
        <button className="navbar-toggle" onClick={() => setOpen((prev) => !prev)} aria-label="Мәзір">
          ☰
        </button>
        <div className={`navbar-links ${open ? 'open' : ''}`}>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              {item.label}
            </NavLink>
          ))}
          {user?.role === 'student' &&
            studentItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {item.label}
              </NavLink>
            ))}
          {user?.role === 'employer' &&
            employerItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {item.label}
              </NavLink>
            ))}
          {user?.role === 'admin' &&
            adminItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {item.label}
              </NavLink>
            ))}
        </div>
        <div className="navbar-actions">
          {user ? (
            <>
              <span className="navbar-user">{user.name}</span>
              <Button variant="ghost" onClick={logout}>
                {kk.nav.logout}
              </Button>
            </>
          ) : (
            <div className="navbar-auth">
              <Link to="/auth/login">{kk.nav.login}</Link>
              <Link to="/auth/register" className="btn btn-primary">
                {kk.nav.register}
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
