import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';
import '../styles/auth.css';

export default function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get('/jobs/public').then(res => setJobs(res.data.items || []));
  }, []);

  return (
    <main style={{ padding: '28px 48px', maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, marginBottom: 12 }}>Available Jobs</h2>
      {jobs.length === 0 && <div style={{ color: 'var(--muted)' }}>No public jobs yet.</div>}
      {jobs.map(job => (
        <div key={job._id} style={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: 12, padding: 16, marginBottom: 12, background: 'var(--card-bg)' }}>
          <h3 style={{ margin: 0 }}>{job.JobTitle}</h3>
          <p style={{ margin: '6px 0 0' }}>{job.JobDescription}</p>
          <p style={{ color: 'var(--muted)', marginTop: 8 }}>{job.Location}</p>
        </div>
      ))}
    </main>
  );
}