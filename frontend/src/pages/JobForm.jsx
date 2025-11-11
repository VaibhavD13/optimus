// frontend/src/ui/JobForm.jsx
import React, { useState } from 'react';
import api from '../api/apiClient';

export default function JobForm({ companyId = '', onSaved = () => {} }) {
  const [form, setForm] = useState({
    JobTitle: '',
    JobDescription: '',
    Location: '',
    EmploymentType: 'FullTime', // FullTime, PartTime, Contract
    MinExperience: '',
    MaxExperience: '',
    SalaryMin: '',
    SalaryMax: '',
    Skills: [],
    IsPublished: false
  });
  const [skillInput, setSkillInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  function update(key, val) {
    setForm(f => ({ ...f, [key]: val }));
  }

  function addSkill() {
    const s = skillInput.trim();
    if (!s) return;
    if (form.Skills.includes(s)) {
      setSkillInput('');
      return;
    }
    update('Skills', [...form.Skills, s]);
    setSkillInput('');
  }

  function removeSkill(skill) {
    update('Skills', form.Skills.filter(s => s !== skill));
  }

  function validate() {
    if (!form.JobTitle.trim()) return 'Job title is required';
    if (!form.JobDescription.trim()) return 'Job description is required';
    if (!form.Location.trim()) return 'Location is required';
    return null;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) { setError(v); return; }

    setSaving(true);
    try {
      // backend expects POST /jobs/:companyId (as used earlier)
      // If your apiClient baseURL is /api/v1, this will map to /api/v1/jobs/:companyId
      const path = companyId ? `/jobs/${companyId}` : `/jobs`;
      const payload = {
        ...form
      };
      const res = await api.post(path, payload);
      // success message and clear form or call parent
      alert('Job saved successfully');
      setForm({
        JobTitle: '',
        JobDescription: '',
        Location: '',
        EmploymentType: 'FullTime',
        MinExperience: '',
        MaxExperience: '',
        SalaryMin: '',
        SalaryMax: '',
        Skills: [],
        IsPublished: false
      });
      onSaved(res.data || {});
    } catch (err) {
      console.error('Save job failed', err);
      setError(err?.response?.data?.error || 'Failed to save job');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {error && <div className="text-sm text-red-600">{error}</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={form.JobTitle} onChange={(e)=>update('JobTitle', e.target.value)} placeholder="Job title" className="w-full rounded-2xl bg-gray-100 py-3 px-4" />
        <input value={form.Location} onChange={(e)=>update('Location', e.target.value)} placeholder="Location (City)" className="w-full rounded-2xl bg-gray-100 py-3 px-4" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select value={form.EmploymentType} onChange={(e)=>update('EmploymentType', e.target.value)} className="rounded-2xl bg-gray-100 py-3 px-4">
          <option value="FullTime">Full time</option>
          <option value="PartTime">Part time</option>
          <option value="Contract">Contract</option>
          <option value="Internship">Internship</option>
        </select>

        <input value={form.MinExperience} onChange={(e)=>update('MinExperience', e.target.value)} placeholder="Min exp (yrs)" className="rounded-2xl bg-gray-100 py-3 px-4" />
        <input value={form.MaxExperience} onChange={(e)=>update('MaxExperience', e.target.value)} placeholder="Max exp (yrs)" className="rounded-2xl bg-gray-100 py-3 px-4" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={form.SalaryMin} onChange={(e)=>update('SalaryMin', e.target.value)} placeholder="Salary min (e.g., 30000)" className="rounded-2xl bg-gray-100 py-3 px-4" />
        <input value={form.SalaryMax} onChange={(e)=>update('SalaryMax', e.target.value)} placeholder="Salary max (e.g., 70000)" className="rounded-2xl bg-gray-100 py-3 px-4" />
      </div>

      <div>
        <label className="text-sm text-slate-600 block mb-2">Skills</label>
        <div className="flex gap-2 items-center">
          <input value={skillInput} onChange={(e)=>setSkillInput(e.target.value)} onKeyDown={(e)=>{ if (e.key === 'Enter') { e.preventDefault(); addSkill(); } }} placeholder="Type skill and press Enter" className="flex-1 rounded-2xl bg-gray-100 py-3 px-4" />
          <button type="button" onClick={addSkill} className="rounded-2xl bg-optimus-blue-500 text-white px-4 py-2">Add</button>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {form.Skills.map(s => (
            <div key={s} className="flex items-center gap-2 bg-slate-100 px-3 py-1 rounded-full text-sm">
              <span>{s}</span>
              <button type="button" onClick={()=>removeSkill(s)} className="text-xs text-slate-500">✕</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm text-slate-600 block mb-2">Job description</label>
        <textarea value={form.JobDescription} onChange={(e)=>update('JobDescription', e.target.value)} rows={6} className="w-full rounded-xl bg-gray-100 p-4" placeholder="Describe responsibilities, requirements, benefits..."></textarea>
      </div>

      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2">
          <input type="checkbox" checked={form.IsPublished} onChange={(e)=>update('IsPublished', e.target.checked)} />
          <span className="text-sm text-slate-600">Publish now</span>
        </label>

        <button type="submit" disabled={saving} className="ml-auto rounded-2xl bg-black text-white px-6 py-3">
          {saving ? 'Saving...' : 'Save Job'}
        </button>
      </div>
    </form>
  );
}