import React from 'react';
import PropTypes from 'prop-types';
import '../styles/auth.css';

export default function AuthLayout({ title, children }) {
  return (
    <div className="auth-split" role="main" aria-label={title || 'Auth'}>
      <div className="left-panel" aria-hidden="true">
        <div className="left-card">
          <div className="brand-title">Optimus</div>
          <div className="brand-sub">A modern, secure SaaS job board for companies and applicants. Fast, reliable, and multi-tenant ready.</div>
          <div className="brand-anim">Brand animation here</div>
        </div>
      </div>

      <div className="right-panel">
        <div className="auth-card">
          {children}
        </div>
      </div>
    </div>
  );
}

AuthLayout.propTypes = {
  title: PropTypes.string,
  children: PropTypes.node
};