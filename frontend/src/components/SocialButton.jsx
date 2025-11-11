// src/components/SocialButton.jsx
import React from 'react';

export default function SocialButton({ children, icon, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white border border-gray-200 rounded-xl py-3 flex items-center gap-3 px-4 shadow-sm hover:shadow-md transition
                 text-sm text-slate-700"
    >
      <span className="w-6 h-6 flex items-center justify-center">{icon}</span>
      <span className="flex-1 text-center">{children}</span>
    </button>
  );
}