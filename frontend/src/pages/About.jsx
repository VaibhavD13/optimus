import React from 'react';

export default function About() {
  return (
    <>
      <main style={{ padding: 28, maxWidth: 900, margin: '0 auto' }}>
        <h1>About Optimus</h1>
        <p style={{ color: 'var(--muted)' }}>
          Optimus is a SaaS job board platform focused on privacy, multi-tenant separation and ease of use. It provides user roles for Applicants, Employers and Admins,
          secure cookie-based authentication, and multi-tenant scoping for company data.
        </p>

        <h3 style={{ marginTop: 20 }}>Why Optimus?</h3>
        <ul>
          <li>Secure by default — cookie-based JWT with tenant isolation</li>
          <li>Built for scale — Express + MongoDB</li>
          <li>Modern frontend — React + Vite</li>
        </ul>
      </main>
    </>
  );
}