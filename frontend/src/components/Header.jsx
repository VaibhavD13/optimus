import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/header.css';

export default function Header() {
  const { user, logout } = useAuth();
  const [dark, setDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark');
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    document.body.style.setProperty('--header-height', '72px');
  }, [dark]);

  async function handleLogout() {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <header className="saas-header" role="banner">
      <div className="container">
        <div className="left">
          <Link to="/" className="brand" onClick={() => setOpen(false)}>
            <span className="brand-logo" aria-hidden>🔷</span>
            <span className="brand-text">Optimus</span>
          </Link>
        </div>

        <nav className={`nav ${open ? 'open' : ''}`} role="navigation" aria-label="Main navigation">
          <Link to="/" className="nav-link" onClick={() => setOpen(false)}>Home</Link>
          <Link to="/about" className="nav-link" onClick={() => setOpen(false)}>About</Link>
          <Link to="/jobs" className="nav-link" onClick={() => setOpen(false)}>Jobs</Link>
          <Link to="/contact" className="nav-link" onClick={() => setOpen(false)}>Contact</Link>

          {!user && (
            <>
              <Link to="/login" className="nav-link auth-link" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/register" className="nav-link auth-link" onClick={() => setOpen(false)}>Sign up</Link>
            </>
          )}

          {user && user.Role === 'Employer' && (
            <Link to="/dashboard" className="nav-link" onClick={() => setOpen(false)}>Dashboard</Link>
          )}
        </nav>

        <div className="right">
          <button
            className="theme-toggle"
            onClick={() => setDark(d => !d)}
            aria-pressed={dark}
            title={dark ? 'Light' : 'Dark'}
          >
            {dark ? '🌙' : '🌤️'}
          </button>

          {user ? (
            <div className="user-menu">
              <button className="avatar-btn" title={user.FirstName || user.Email}>
                <span className="avatar">{(user.FirstName || 'U').charAt(0).toUpperCase()}</span>
              </button>
              <div className="user-dropdown">
                <div className="user-info">
                  <strong>{user.FirstName || user.Email}</strong>
                  <div className="muted">{user.Role}</div>
                </div>
                <Link to="/profile" className="dropdown-item">Profile</Link>
                <button className="dropdown-item danger" onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : null}

          <button
            className={`hamburger ${open ? 'is-open' : ''}`}
            onClick={() => setOpen(s => !s)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>
    </header>
  );
}