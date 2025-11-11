// frontend/src/ui/TopCards.jsx
import React from 'react';

export default function TopCards({ summary }) {
  const items = [
    { title: 'Total Projects', value: summary?.TotalProjects ?? 0 },
    { title: 'Total Tasks', value: summary?.TotalTasks ?? 0 },
    { title: 'Members', value: summary?.Members ?? 0 },
    { title: 'Productivity', value: summary?.Productivity ?? '0%' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((it, idx) => (
        <div key={idx} className="bg-white p-4 rounded-xl shadow-sm flex flex-col">
          <div className="text-xs text-slate-500">{it.title}</div>
          <div className="mt-2 text-2xl font-semibold">{it.value}</div>
        </div>
      ))}
    </div>
  );
}