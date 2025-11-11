// src/pages/ResetPassword.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/apiClient';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const userId = searchParams.get('id') || '';
  const [Password, setPassword] = useState('');
  const [Confirm, setConfirm] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token || !userId) setErr('Invalid reset link');
  }, [token, userId]);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    if (!Password) return setErr('Enter new password');
    if (Password !== Confirm) return setErr('Passwords do not match');
    setBusy(true);
    try {
      await api.post('/auth/reset', { token, userId, password: Password });
      setMsg('Password reset successful. Redirecting to sign in...');
      setTimeout(() => navigate('/login'), 1200);
    } catch (ex) {
      setErr(ex?.response?.data?.error || 'Unable to reset password');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-6"><h1 className="text-xl font-semibold">Reset Password</h1></div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          {msg && <div className="text-sm text-green-700 mb-3">{msg}</div>}
          {err && <div className="text-sm text-red-600 mb-3">{err}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="password" value={Password} onChange={(e)=>setPassword(e.target.value)} placeholder="New password" className="w-full rounded-2xl bg-gray-100 py-4 px-4 text-sm" />
            <input type="password" value={Confirm} onChange={(e)=>setConfirm(e.target.value)} placeholder="Confirm password" className="w-full rounded-2xl bg-gray-100 py-4 px-4 text-sm" />
            <button disabled={busy} type="submit" className="w-full rounded-2xl bg-black text-white py-4 font-semibold">{busy ? 'Resetting...' : 'Reset password'}</button>
            <div className="mt-3 text-center text-xs text-slate-500">
              <Link to="/login" className="text-violet-600">Back to Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}