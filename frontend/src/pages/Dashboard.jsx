import React, { useEffect, useState } from 'react';
import api from '../api/apiClient';
import { useAuth } from '../context/AuthContext';
import '../styles/auth.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (user?.CompanyId) {
      api.get(`/jobs/company/${user.CompanyId}`).then(res => setJobs(res.data.items || []));
    }
  }, [user]);

  const togglePublish = async (id, publish) => {
    await api.post(`/jobs/${id}/publish`, { publish });
    const res = await api.get(`/jobs/company/${user.CompanyId}`);
    setJobs(res.data.items || []);
  };

  return (
    <main style={{ padding: '28px 48px', maxWidth: 1200, margin: '0 auto' }}>
      <h2 style={{ fontSize: 24, marginBottom: 12 }}>My Company Jobs</h2>
      {jobs.map(j => (
        <div key={j._id} style={{ border: '1px solid rgba(0,0,0,0.06)', borderRadius: 12, padding: 16, marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--card-bg)' }}>
          <div>
            <h3 style={{ margin: 0 }}>{j.JobTitle}</h3>
            <p style={{ margin: '6px 0 0' }}>{j.JobDescription}</p>
          </div>
          <button onClick={() => togglePublish(j._id, !j.IsPublished)} style={{ padding: '8px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: j.IsPublished ? '#f59e0b' : '#10b981', color: '#fff' }}>
            {j.IsPublished ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      ))}
    </main>
  );
}