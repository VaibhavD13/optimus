// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ FirstName: '', Email: '', Password: '', Role: 'Applicant', CompanyId: '' });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  function update(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr(null);
    if (!form.FirstName || !form.Email || !form.Password) {
      setErr('Please fill in required fields');
      return;
    }
    setBusy(true);
    try {
      await register(form);
      navigate('/');
    } catch (ex) {
      setErr(ex?.response?.data?.error || 'Registration failed');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md px-6">
        <div className="text-center mb-6">
          <h1 className="text-xl font-semibold">Create account</h1>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm">
          {err && <div className="text-sm text-red-600 mb-3">{err}</div>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input name="FirstName" value={form.FirstName} onChange={update} placeholder="First name" className="w-full rounded-2xl bg-gray-100 py-4 px-4 text-sm" />
            <input name="Email" value={form.Email} onChange={update} placeholder="Email" className="w-full rounded-2xl bg-gray-100 py-4 px-4 text-sm" />
            <input name="Password" type="password" value={form.Password} onChange={update} placeholder="Password" className="w-full rounded-2xl bg-gray-100 py-4 px-4 text-sm" />
            <select name="Role" value={form.Role} onChange={update} className="w-full rounded-2xl bg-gray-100 py-3 px-4 text-sm">
              <option>Applicant</option>
              <option>Employer</option>
            </select>
            <input name="CompanyId" value={form.CompanyId} onChange={update} placeholder="CompanyId (optional)" className="w-full rounded-2xl bg-gray-100 py-4 px-4 text-sm" />

            <button type="submit" disabled={busy} className="w-full rounded-2xl bg-black text-white py-4 font-semibold">
              {busy ? 'Creating...' : 'Create account'}
            </button>

            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-slate-500">
              <span>Already have an account?</span>
              <a href="/login" className="text-violet-600">Sign in</a>
            </div>
          </form>
        </div>

        <div className="mt-6 text-center text-xs text-gray-400">
          By continuing you agree to our Terms and Privacy
        </div>
      </div>
    </div>
  );
}