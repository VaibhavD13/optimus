// frontend/src/ui/JobList.jsx
import React, { useState } from 'react';
import api from '../api/apiClient';

export default function JobList({ jobs = [], loading = false, onChanged = ()=>{}, companyId = '' }) {
  const [busyId, setBusyId] = useState(null);

  async function togglePublish(job) {
    setBusyId(job._id);
    try {
      // PATCH /jobs/:jobId/publish with { publish: true/false } (as earlier you had)
      await api.post(`/jobs/${job._id}/publish`, { publish: !job.IsPublished });
      alert(job.IsPublished ? 'Unpublished' : 'Published');
      onChanged();
    } catch (err) {
      console.error(err);
      alert('Publish action failed');
    } finally {
      setBusyId(null);
    }
  }

  async function remove(job) {
    if (!confirm('Delete this job? This action cannot be undone.')) return;
    setBusyId(job._id);
    try {
      await api.delete(`/jobs/${job._id}`);
      alert('Job deleted');
      onChanged();
    } catch (err) {
      console.error(err);
      alert('Delete failed');
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <div className="py-6 text-sm text-slate-500">Loading jobs...</div>;
  if (!jobs.length) return <div className="py-6 text-sm text-slate-500">No jobs yet. Create your first job above.</div>;

  return (
    <div className="space-y-3">
      {jobs.map(job => (
        <div key={job._id || job.id} className="flex items-center justify-between border rounded-lg p-3">
          <div>
            <div className="text-sm font-medium text-slate-700">{job.JobTitle || job.title}</div>
            <div className="text-xs text-slate-500">{job.Location || job.Location || '—' } • {job.EmploymentType || '—'}</div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-500">{job.Applicants ?? job.applicants ?? 0} applicants</div>

            <button onClick={()=>togglePublish(job)} disabled={busyId===job._id} className={`px-3 py-1 rounded-full text-xs ${job.IsPublished ? 'bg-green-50 text-green-700' : 'bg-slate-50 text-slate-700'}`}>
              {busyId===job._id ? '...' : (job.IsPublished ? 'Published' : 'Draft')}
            </button>

            <button onClick={()=>window.location.href=`/employer/jobs/edit/${job._id || job.id}`} className="px-3 py-1 rounded-full bg-slate-100 text-sm">Edit</button>

            <button onClick={()=>remove(job)} disabled={busyId===job._id} className="px-3 py-1 rounded-full bg-red-50 text-red-600 text-sm">Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}