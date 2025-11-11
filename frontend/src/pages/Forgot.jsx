// src/pages/ForgotPassword.jsx
import { useState } from 'react';
import api from '../api/apiClient';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [Email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null); setMsg(null);
    if (!Email) { setErr('Enter your email'); return; }
    setBusy(true);
    try {
      await api.post('/auth/forgot', { Email });
      setMsg('If account exists, a reset link was sent.');
    } catch (ex) {
      setErr('Unable to send reset link');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-6"><h1 className="text-xl font-semibold">Forgot Password</h1></div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          {msg && <div className="text-sm text-green-700 mb-3">{msg}</div>}
          {err && <div className="text-sm text-red-600 mb-3">{err}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <input value={Email} onChange={(e)=>setEmail(e.target.value)} placeholder="Email" className="w-full rounded-2xl bg-gray-100 py-4 px-4 text-sm" />
            <button type="submit" disabled={busy} className="w-full rounded-2xl bg-black text-white py-4 font-semibold">{busy ? 'Sending...' : 'Send reset link'}</button>
            <div className="mt-3 text-center text-xs text-slate-500">
              <Link to="/login" className="text-violet-600">Back to Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}