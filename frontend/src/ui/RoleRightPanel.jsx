import React from 'react';
import Avatar from 'react-avatar';
import QuickActionButton from './QuickActionButton';
import {
  BellIcon,
  StarIcon,
  UserGroupIcon,
  ChartBarIcon,
  ClockIcon,
  UsersIcon,
  EnvelopeOpenIcon,
  BoltIcon,
} from '@heroicons/react/24/outline';

/**
 * RoleRightPanel — polished with scrollable sections
 * - Animated width
 * - Collapsed tooltip mode
 * - Hidden scrollbar (only visible while scrolling)
 */
export default function RoleRightPanel({ role = 'employer', collapsed = false }) {
  // Mock data
  const notifs = new Array(10).fill(0).map((_, i) => ({
    id: i + 1,
    title: `New application #${i + 1} received`,
    time: `${Math.max(1, i)} min ago`,
  }));

  const contacts = new Array(8).fill(0).map((_, i) => `Contact ${i + 1}`);

  const expandedWidth = '20rem'; // 320px
  const collapsedWidth = '4rem'; // 64px

  return (
    <aside
      className="bg-white border-l min-h-screen hidden md:flex flex-col transition-width shadow-sm"
      style={{ width: collapsed ? collapsedWidth : expandedWidth }}
    >
      {/* Collapsed Mode */}
      {collapsed ? (
        <div className="flex flex-col items-center py-4 gap-3 w-full">
          {[
            { id: 'notifs', title: 'Notifications', icon: BellIcon },
            { id: 'shortlist', title: 'Shortlists', icon: StarIcon },
            { id: 'contacts', title: 'Contacts', icon: UserGroupIcon },
            { id: 'kpis', title: 'Quick KPIs', icon: ChartBarIcon },
          ].map((it) => {
            const Icon = it.icon;
            return (
              <div key={it.id} className="relative group w-full flex justify-center">
                <button
                  className="p-2 rounded-md flex items-center justify-center hover:bg-gray-100 text-slate-600"
                  aria-label={it.title}
                >
                  <Icon className="h-5 w-5" />
                </button>
                <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                  {it.title}
                </div>
              </div>
            );
          })}
          <div className="flex-1" />
        </div>
      ) : (
        // Expanded mode — scrollable sections
        <div
          className="p-4 flex-1 flex flex-col gap-5 overflow-y-auto no-scrollbar"
          style={{ scrollbarGutter: 'stable', WebkitOverflowScrolling: 'touch' }}
        >
          {/* Notifications */}
          <section className="border rounded-2xl p-4 shadow-sm bg-white hover:shadow-md transition">
            <div className="flex items-center justify-between mb-3 border-b pb-2">
              <div className="flex items-center gap-2">
                <BellIcon className="h-5 w-5 text-optimus-blue-600" />
                <h4 className="text-sm font-semibold text-slate-700">
                  Notifications
                </h4>
              </div>
              <button className="text-xs text-slate-400 hover:text-slate-600">
                Mark all
              </button>
            </div>

            <div
              className="space-y-3 text-sm text-slate-700 overflow-y-auto no-scrollbar"
              style={{
                maxHeight: '160px',
              }}
            >
              {notifs.map((n) => (
                <div
                  key={n.id}
                  className="border-b last:border-0 pb-2 hover:bg-gray-50 rounded-md px-2 -mx-2"
                >
                  <div className="font-medium">{n.title}</div>
                  <div className="text-xs text-slate-400">{n.time}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Contacts */}
          <section className="border rounded-2xl p-4 shadow-sm bg-white hover:shadow-md transition">
            <div className="flex items-center gap-2 mb-3 border-b pb-2">
              <UserGroupIcon className="h-5 w-5 text-optimus-blue-600" />
              <h5 className="text-sm font-semibold text-slate-700">Contacts</h5>
            </div>
            <div
              className="space-y-3 overflow-y-auto no-scrollbar"
              style={{
                maxHeight: '200px',
              }}
            >
              {contacts.map((n, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 hover:bg-gray-50 rounded-md p-2"
                >
                  <Avatar name={n} size="34" round />
                  <div>
                    <div className="text-sm font-medium">{n}</div>
                    <div className="text-xs text-slate-400 flex items-center gap-1">
                      <EnvelopeOpenIcon className="h-3 w-3 text-slate-400" /> Message
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Quick KPIs */}
          <section className="border rounded-2xl p-4 shadow-sm bg-white hover:shadow-md transition flex flex-col gap-3">
            <div className="flex items-center gap-2 border-b pb-2">
              <ChartBarIcon className="h-5 w-5 text-optimus-blue-600" />
              <h5 className="text-sm font-semibold text-slate-700">Quick KPIs</h5>
            </div>
            <div
              className="grid grid-cols-1 gap-3 text-sm text-slate-600 overflow-y-auto no-scrollbar"
              style={{
                maxHeight: '150px',
              }}
            >
              <div className="flex items-center justify-between hover:bg-gray-50 rounded-md p-2">
                <div className="flex items-center gap-2">
                  <BoltIcon className="h-4 w-4 text-slate-400" />
                  <span>Open roles</span>
                </div>
                <span className="font-semibold text-slate-800">12</span>
              </div>
              <div className="flex items-center justify-between hover:bg-gray-50 rounded-md p-2">
                <div className="flex items-center gap-2">
                  <UsersIcon className="h-4 w-4 text-slate-400" />
                  <span>Applicants (7d)</span>
                </div>
                <span className="font-semibold text-slate-800">87</span>
              </div>
              <div className="flex items-center justify-between hover:bg-gray-50 rounded-md p-2">
                <div className="flex items-center gap-2">
                  <ClockIcon className="h-4 w-4 text-slate-400" />
                  <span>Avg time-to-hire</span>
                </div>
                <span className="font-semibold text-slate-800">12 days</span>
              </div>
            </div>
          </section>

          {/* Quick Action */}
          <section className="border rounded-2xl p-4 shadow-sm bg-white hover:shadow-md transition mb-2">
            <div className="flex items-center gap-2 border-b pb-2 mb-3">
              <StarIcon className="h-5 w-5 text-optimus-blue-600" />
              <h5 className="text-sm font-semibold text-slate-700">
                Quick Actions
              </h5>
            </div>
            <QuickActionButton
              label="Post a job"
              onClick={() => (window.location.href = '/employer/jobs/new')}
            />
          </section>
        </div>
      )}
    </aside>
  );
}