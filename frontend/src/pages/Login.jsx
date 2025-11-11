// frontend/src/pages/Login.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FcGoogle } from 'react-icons/fc';
import { SiApple } from 'react-icons/si';

export default function Login() {
  const { login, user, loading: authLoading, setUserFromServer } = useAuth ? useAuth() : {};
  // Note: if your AuthContext doesn't export setUserFromServer, AuthContext.login will refresh user.
  // The code below will call login() and then redirect.
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  // If user already logged in, redirect to home
  useEffect(() => {
    if (user) navigate('/');
  }, [user, navigate]);

  // If redirected back from OAuth flow, try to re-load user
  useEffect(() => {
    const oauth = searchParams.get('oauth');
    if (oauth === 'success') {
      // Try to refresh user by calling login-less fetch from AuthContext
      // If your AuthContext exposes a method to reload user, call it.
      // We'll attempt to call login with no creds by calling /users/me via context (best if AuthContext fetches on mount)
      // As fallback, just reload the page to let AuthContext fetch on mount.
      try {
        // If AuthContext provides a helper to refresh user, call it:
        if (typeof setUserFromServer === 'function') {
          setUserFromServer();
        } else {
          // Force a reload so AuthContext's initial effect picks up cookies set by backend
          window.location.replace('/');
        }
      } catch {
        window.location.replace('/');
      }
    }
    if (oauth === 'fail') {
      setErr('OAuth sign-in failed — try another method or try again.');
    }
  }, [searchParams, setUserFromServer]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    if (!Email || !Password) {
      setErr('Please enter both email and password.');
      return;
    }
    setBusy(true);
    try {
      // login is provided by AuthContext and should set user state
      await login(Email, Password);
      // redirect home (AuthContext sets user)
      navigate('/');
    } catch (error) {
      // axios error shape: error.response.data.error
      const message = error?.response?.data?.error || error?.message || 'Login failed';
      setErr(message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold">Sign In</h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          {err && <div className="text-sm text-red-600 mb-3">{err}</div>}

          <form onSubmit={handleSubmit} className="space-y-4" autoComplete="on">
            <input
              name="Email"
              value={Email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or Phone number"
              className="w-full rounded-2xl bg-gray-100 py-4 px-4 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              autoComplete="username"
              type="email"
              aria-label="Email"
            />

            <input
              name="Password"
              value={Password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-2xl bg-gray-100 py-4 px-4 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
              autoComplete="current-password"
              type="password"
              aria-label="Password"
            />

            <button
              type="submit"
              disabled={busy}
              className={`w-full rounded-2xl ${
                busy ? 'bg-gray-800/80' : 'bg-black'
              } text-white py-4 font-semibold shadow`}
              aria-busy={busy}
            >
              {busy ? 'Signing in...' : 'Sign In'}
            </button>

            <div className="flex items-center justify-center gap-6 mt-3 text-xs text-slate-500">
              <Link to="/register" className="text-violet-600 hover:underline">Sign Up</Link>
              <Link to="/forgot" className="text-violet-600 hover:underline">Forgot Password</Link>
              <Link to="/contact" className="text-violet-600 hover:underline">Contact Us</Link>
            </div>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="text-xs text-gray-400">or</div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <div className="mt-6 space-y-3">
            <a href="/api/v1/auth/oauth/google" className="block">
              <div className="w-full bg-white border border-gray-200 rounded-xl py-3 flex items-center gap-3 px-4 shadow-sm hover:shadow-md transition text-sm text-slate-700">
                <span className="w-6 h-6 flex items-center justify-center"><FcGoogle className="w-5 h-5" /></span>
                <span className="flex-1 text-center">Sign in with Google</span>
              </div>
            </a>

            <a href="/api/v1/auth/oauth/microsoft" className="block">
                <div className="w-full bg-white border border-gray-200 rounded-xl py-3 flex items-center gap-3 px-4 shadow-sm hover:shadow-md transition text-sm text-slate-700">
                    <span className="w-6 h-6 flex items-center justify-center">
                    <svg viewBox="0 0 24 24" className="w-5 h-5">
                        <path d="M0 0h11v11H0z" fill="#F35325"></path>
                        <path d="M13 0h11v11H13z" fill="#81BC06"></path>
                        <path d="M0 13h11v11H0z" fill="#05A6F0"></path>
                        <path d="M13 13h11v11H13z" fill="#FFBA08"></path>
                    </svg>
                    </span>
                    <span className="flex-1 text-center">Sign in with Microsoft</span>
                </div>
                </a>

            <a href="/api/v1/auth/oauth/apple" className="block">
              <div className="w-full bg-white border border-gray-200 rounded-xl py-3 flex items-center gap-3 px-4 shadow-sm hover:shadow-md transition text-sm text-slate-700">
                <span className="w-6 h-6 flex items-center justify-center"><SiApple className="w-5 h-5" /></span>
                <span className="flex-1 text-center">Sign in with Apple</span>
              </div>
            </a>
          </div>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          Terms of Use &nbsp; | &nbsp; Privacy Policy
        </div>
      </div>
    </div>
  );
}