// frontend/src/ui/RightPanel.jsx
import React from 'react';
import Avatar from 'react-avatar';

export default function RightPanel() {
  const activities = [
    { text: 'Edited the details of Project X', time: 'Just now' },
    { text: 'Released a new version', time: '59 minutes ago' },
    { text: 'Submitted a bug', time: '12 hours ago' }
  ];

  const contacts = ['Natali Craig','Drew Cano','Orlando Diggs','Andi Lane','Kate Morrison'].map((n,i)=>({name:n}));

  return (
    <div className="bg-white p-4 rounded-2xl shadow-sm">
      <h4 className="font-semibold mb-3">Notifications</h4>
      <div className="space-y-3 mb-4">
        {activities.map((a, i) => (
          <div key={i} className="text-sm">
            <div className="text-slate-700">{a.text}</div>
            <div className="text-xs text-slate-400">{a.time}</div>
          </div>
        ))}
      </div>

      <h4 className="font-semibold mb-3">Contacts</h4>
      <div className="space-y-3">
        {contacts.map((c, i) => (
          <div key={i} className="flex items-center gap-3">
            <Avatar name={c.name} size="36" round />
            <div className="text-sm">{c.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}