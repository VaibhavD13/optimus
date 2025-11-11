import React from 'react';
import '../styles/auth.css';

export default function Home() {
  return (
    <main style={{ padding: '28px 48px' }}>
      <section style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '520px 1fr', gap: '40px', alignItems: 'start' }}>
        <div>
          <h1 style={{ fontSize: 36, marginTop: 18 }}>Find talent or your next job — fast.</h1>
          <p style={{ color: 'var(--muted)', marginTop: 12, maxWidth: '40ch' }}>Optimus is a modern SaaS job board built for companies and applicants. Secure, multi-tenant, and easy to scale.</p>
          <div style={{ marginTop: 18 }}>
            <a href="/register" className="primary-btn" style={{ display: 'inline-block', width: 'auto', padding: '10px 16px' }}>Sign up</a>
            <a href="/jobs" style={{ marginLeft: 12, fontWeight: 600 }}>Browse jobs</a>
          </div>
          <div style={{ height: 18 }} />
        </div>

        <div>
          <div style={{ background: 'var(--card-bg)', padding: 20, borderRadius: 12, boxShadow: 'var(--card-shadow)', marginBottom: 18 }}>
            <h3 style={{ margin: 0 }}>For employers</h3>
            <p style={{ color: 'var(--muted)' }}>Post jobs, review candidates and scale hiring.</p>
          </div>
          <div style={{ background: 'var(--card-bg)', padding: 20, borderRadius: 12, boxShadow: 'var(--card-shadow)' }}>
            <h3 style={{ margin: 0 }}>For applicants</h3>
            <p style={{ color: 'var(--muted)' }}>Create your profile, apply and track applications.</p>
          </div>
        </div>
      </section>

      <section style={{ maxWidth: 1200, margin: '40px auto' }}>
        <h2>Recent jobs</h2>
        <p style={{ color: 'var(--muted)' }}>Visit the Jobs page to see public job listings.</p>
      </section>
    </main>
  );
}