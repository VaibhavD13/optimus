// src/ui/QuickActionButton.jsx
import React from 'react';

export default function QuickActionButton({ label, onClick, className = '' }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-sm py-2 rounded-lg bg-gradient-to-r from-optimus-blue-500 to-violet-600 text-white font-semibold shadow-sm ${className}`}
    >
      {label}
    </button>
  );
}