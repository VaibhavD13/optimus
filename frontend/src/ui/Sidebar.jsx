// frontend/src/ui/Sidebar.jsx
import React from 'react';
import { HomeIcon, FolderIcon, ChartBarIcon, UserIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';

export default function Sidebar({ active }) {
  return (
    <aside className="w-72 bg-white border-r min-h-screen px-4 py-6 hidden md:block">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold">O</div>
          <div className="text-lg font-semibold">Optimus</div>
        </div>
      </div>

      <nav className="space-y-2 text-sm text-slate-700">
        <div className={`p-3 rounded-lg ${active==='overview' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}><Link to="/">Overview</Link></div>
        <div className={`p-3 rounded-lg ${active==='projects' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}><Link to="/">Projects</Link></div>
        <div className={`p-3 rounded-lg ${active==='tasks' ? 'bg-slate-100' : 'hover:bg-slate-50'}`}><Link to="/">Tasks</Link></div>
        <div className="mt-4 text-xs text-slate-400 uppercase">Pages</div>
        <div className="p-3 rounded-lg hover:bg-slate-50"><Link to="/profile">User Profile</Link></div>
        <div className="p-3 rounded-lg hover:bg-slate-50"><Link to="/campaigns">Campaigns</Link></div>
      </nav>
    </aside>
  );
}