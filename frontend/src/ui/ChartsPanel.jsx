// frontend/src/ui/ChartsPanel.jsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#10B981','#60A5FA','#F97316'];

export default function ChartsPanel({ overview, series = [], mini = false }) {
  const pieData = [
    { name: 'Completed', value: overview?.Completed ?? 67.6 },
    { name: 'In Progress', value: overview?.InProgress ?? 26.4 },
    { name: 'Behind', value: overview?.Behind ?? 6 }
  ];

  if (mini) {
    return (
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={series}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sprint" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill="#60A5FA" />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div>
      <div style={{ width: '100%', height: 200 }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={pieData} dataKey="value" innerRadius={48} outerRadius={80} paddingAngle={2}>
              {pieData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4">
        <ul className="text-sm space-y-2">
          <li className="flex justify-between"><span className="text-slate-600">Completed</span><span>{pieData[0].value}%</span></li>
          <li className="flex justify-between"><span className="text-slate-600">In Progress</span><span>{pieData[1].value}%</span></li>
          <li className="flex justify-between"><span className="text-slate-600">Behind</span><span>{pieData[2].value}%</span></li>
        </ul>
      </div>
    </div>
  );
}