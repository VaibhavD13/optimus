import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [Email, setEmail] = useState('');
  const [Password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(Email, Password);
      navigate('/');
    } catch {
      alert('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      <input type="email" placeholder="Email" className="border p-2 w-full mb-2"
        value={Email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" className="border p-2 w-full mb-2"
        value={Password} onChange={e => setPassword(e.target.value)} />
      <button className="bg-blue-500 text-white px-4 py-2 rounded">Login</button>
    </form>
  );
}