import React, { useState } from 'react';
import AuthLayout from '../components/AuthLayout';
import api from '../api/apiClient';
import '../styles/auth.css';

export default function Contact() {
  const [Name, setName] = useState('');
  const [Email, setEmail] = useState('');
  const [Message, setMessage] = useState('');
  const [ok, setOk] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    try {
      await api.post('/contact', { Name, Email, Message });
      setOk(true);
    } catch (err) {
      alert('Error submitting contact');
    }
  };

  return (
    <AuthLayout title="Contact Us">
      <h1 className="auth-title">Contact Us</h1>
      {!ok ? (
        <form className="form" onSubmit={handle}>
          <input className="input" placeholder="Full name" value={Name} onChange={e => setName(e.target.value)} required />
          <input className="input" placeholder="Email" value={Email} onChange={e => setEmail(e.target.value)} required />
          <textarea className="input" placeholder="Your message" value={Message} onChange={e => setMessage(e.target.value)} style={{minHeight:120}} required />
          <button className="primary-btn" type="submit">Send message</button>
        </form>
      ) : <div>Thanks — we received your message.</div>}
    </AuthLayout>
  );
}