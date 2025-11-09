import { useEffect, useState } from 'react';
import api from '../api/apiClient';

export default function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get('/jobs/public').then(res => setJobs(res.data.items));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Available Jobs</h2>
      {jobs.map(job => (
        <div key={job._id} className="border p-3 mb-2 rounded shadow">
          <h3 className="font-semibold">{job.JobTitle}</h3>
          <p>{job.JobDescription}</p>
          <p className="text-sm text-gray-600">{job.Location}</p>
        </div>
      ))}
    </div>
  );
}