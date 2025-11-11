// frontend/src/ui/TasksTable.jsx
import React from 'react';
import Avatar from 'react-avatar';

export default function TasksTable({ items = [] }) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Tasks</h3>
      <div className="space-y-3">
        {items.map(it => (
          <div key={it._id} className="flex items-center justify-between border rounded-lg p-3">
            <div>
              <div className="font-medium">{it.Title || it.JobTitle || 'Untitled'}</div>
              <div className="text-xs text-slate-500">{it.Location || (it.JobDescription ? it.JobDescription.slice(0,60) : '')}</div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-2">
                {(it.Assignees || it.Assignee || []).slice?.(0,3).map((a, idx) => (
                  <Avatar key={idx} name={a.name || a.FirstName || 'U'} size="28" round={true} />
                ))}
              </div>
              <div className="text-sm text-slate-500 mr-4">{it.TimeSpent || it.CreatedAt ? new Date(it.CreatedAt).toLocaleDateString() : ''}</div>
              <div>
                <span className={`px-3 py-1 rounded-full text-xs ${statusClass(it.Status)}`}>{it.Status || 'Submitted'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function statusClass(status) {
  switch ((status||'').toLowerCase()) {
    case 'in progress': return 'bg-blue-50 text-blue-600';
    case 'pending': return 'bg-yellow-50 text-yellow-700';
    case 'approved': return 'bg-green-50 text-green-700';
    case 'completed': return 'bg-green-50 text-green-700';
    case 'rejected': return 'bg-red-50 text-red-700';
    default: return 'bg-slate-50 text-slate-700';
  }
}