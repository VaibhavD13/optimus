import { useEffect, useState } from 'react';
import api from '../api/apiClient';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (user?.CompanyId) {
      api.get(`/jobs/company/${user.CompanyId}`).then(res => setJobs(res.data.items));
    }
  }, [user]);

  const togglePublish = async (id, publish) => {
    await api.post(`/jobs/${id}/publish`, { publish });
    const res = await api.get(`/jobs/company/${user.CompanyId}`);
    setJobs(res.data.items);
  };

  if (!user) return null;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">My Company Jobs</h2>
      {jobs.map(j => (
        <div key={j._id} className="border p-3 mb-2 rounded shadow flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{j.JobTitle}</h3>
            <p>{j.JobDescription}</p>
          </div>
          <button
            onClick={() => togglePublish(j._id, !j.IsPublished)}
            className={`px-3 py-1 rounded ${j.IsPublished ? 'bg-yellow-500' : 'bg-green-600'} text-white`}>
            {j.IsPublished ? 'Unpublish' : 'Publish'}
          </button>
        </div>
      ))}
    </div>
  );
}