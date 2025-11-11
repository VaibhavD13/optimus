// src/pages/EmployerDashboard.jsx
import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, ResponsiveContainer,
} from "recharts";
import Layout from "../ui/Layout";
import { useAuth } from "../context/AuthContext";
import { BriefcaseIcon, UsersIcon, ClockIcon, ChartBarIcon } from "@heroicons/react/24/outline";

export default function EmployerDashboard() {
  const { user } = useAuth();
  const role = (user?.Role || "employer").toLowerCase();

  // collapses
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);

  const summary = [
    { id: 1, title: "Open Roles", value: 12, icon: BriefcaseIcon },
    { id: 2, title: "Active Applicants", value: 87, icon: UsersIcon },
    { id: 3, title: "Avg. Time-to-Hire", value: "12 days", icon: ClockIcon },
    { id: 4, title: "Productivity", value: "93.8%", icon: ChartBarIcon },
  ];

  const jobsOverview = { Completed: 68, InProgress: 24, Behind: 8 };
  const barData = [{ month: "Jan", hires: 8 }, { month: "Feb", hires: 12 }, { month: "Mar", hires: 9 }, { month: "Apr", hires: 15 }, { month: "May", hires: 11 }, { month: "Jun", hires: 13 }];
  const recentJobs = [
    { id: 1, title: "Backend Developer", applicants: 27, status: "Open", posted: "2 days ago" },
    { id: 2, title: "Frontend Engineer", applicants: 18, status: "Interviewing", posted: "5 days ago" },
    { id: 3, title: "UI/UX Designer", applicants: 32, status: "Closed", posted: "10 days ago" },
    { id: 4, title: "DevOps Engineer", applicants: 15, status: "Open", posted: "1 day ago" }
  ];

  const PIE_COLORS = ['#10B981', '#3B82F6', '#F97316'];
  const BAR_COLOR = '#3B82F6';

  function handleToggleLeft() { setLeftCollapsed(s => !s); }
  function handleToggleRight() { setRightCollapsed(s => !s); }

  return (
    <Layout
      showRightPanel={true}
      leftCollapsed={leftCollapsed}
      rightCollapsed={rightCollapsed}
      onToggleLeft={handleToggleLeft}
      onToggleRight={handleToggleRight}
    >
      {/* MAIN CONTENT: removed max-w and mx-auto so content stretches fully */}
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Employer Dashboard</h1>
          <div className="text-sm text-slate-500">
            Welcome back, <span className="font-semibold">{user?.FirstName || 'Recruiter'}</span>
          </div>
        </div>

        {/* summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {summary.map(c => {
            const Icon = c.icon;
            return (
              <div key={c.id} className="bg-card-bg rounded-xl p-5 shadow-soft">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-optimus-blue-50">
                    <Icon className="h-6 w-6 text-optimus-blue-600" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-text">{c.title}</div>
                    <div className="text-lg font-semibold text-slate-700">{c.value}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <div className="bg-card-bg rounded-xl p-6 shadow-soft">
            <h3 className="font-semibold mb-4">Job Status Overview</h3>
            <div style={{ height: 260 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={[
                    { name: 'Completed', value: jobsOverview.Completed },
                    { name: 'In Progress', value: jobsOverview.InProgress },
                    { name: 'Behind', value: jobsOverview.Behind }
                  ]} dataKey="value" innerRadius={60} outerRadius={90}>
                    {PIE_COLORS.map((col, i) => <Cell key={i} fill={col} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-card-bg rounded-xl p-6 shadow-soft">
            <h3 className="font-semibold mb-4">Monthly Hiring Trend</h3>
            <div style={{ height: 260 }}>
              <ResponsiveContainer>
                <BarChart data={barData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="hires" fill={BAR_COLOR} radius={[6,6,0,0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* table */}
        <div className="bg-card-bg rounded-xl p-6 shadow-soft mt-6">
          <h3 className="font-semibold mb-4">Recent Job Postings</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-muted-text border-b">
                  <th className="pb-3">Job Title</th>
                  <th className="pb-3">Applicants</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Posted</th>
                </tr>
              </thead>
              <tbody>
                {recentJobs.map(job => (
                  <tr key={job.id} className="border-b last:border-none hover:bg-gray-50">
                    <td className="py-3 font-medium text-slate-700">{job.title}</td>
                    <td className="py-3">{job.applicants}</td>
                    <td className="py-3">
                      <span className={`px-3 py-1 rounded-full text-xs ${job.status === 'Open' ? 'bg-green-50 text-green-700' : job.status === 'Interviewing' ? 'bg-blue-50 text-blue-700' : 'bg-gray-50 text-gray-500'}`}>
                        {job.status}
                      </span>
                    </td>
                    <td className="py-3 text-slate-500">{job.posted}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}