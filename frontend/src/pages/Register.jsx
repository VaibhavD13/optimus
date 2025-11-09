import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    FirstName: '', Email: '', Password: '', Role: 'Applicant'
  });

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      navigate('/');
    } catch {
      alert('Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      <input name="FirstName" placeholder="First Name" className="border p-2 w-full mb-2"
        onChange={handleChange} />
      <input name="Email" placeholder="Email" className="border p-2 w-full mb-2"
        onChange={handleChange} />
      <input name="Password" type="password" placeholder="Password" className="border p-2 w-full mb-2"
        onChange={handleChange} />
      <select name="Role" className="border p-2 w-full mb-2" onChange={handleChange}>
        <option value="Applicant">Applicant</option>
        <option value="Employer">Employer</option>
      </select>
      <button className="bg-green-500 text-white px-4 py-2 rounded">Register</button>
    </form>
  );
}