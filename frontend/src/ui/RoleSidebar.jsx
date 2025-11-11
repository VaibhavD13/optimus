import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { MENUS } from '../config/menu';

function MenuItem({ item, active, collapsed }) {
  const Icon = item.icon;
  return (
    <div className="relative group">
      <Link
        to={item.to}
        className={`flex items-center gap-3 p-2 rounded-xl transition-all duration-200 ${
          active ? 'bg-optimus-blue-50' : 'hover:bg-gray-50'
        }`}
      >
        <div
          className={`p-2 rounded-lg ${
            active
              ? 'bg-optimus-blue-100 text-optimus-blue-600'
              : 'bg-white text-slate-600'
          } shadow-sm flex items-center justify-center`}
        >
          <Icon className="h-5 w-5" />
        </div>

        {/* Show label normally when not collapsed */}
        {!collapsed && (
          <span className="text-sm text-slate-700 truncate">{item.title}</span>
        )}
      </Link>

      {/* Tooltip (visible only when collapsed) */}
      {collapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1 rounded-md bg-gray-900 text-white text-xs font-medium opacity-0 group-hover:opacity-100 whitespace-nowrap transition-opacity duration-200 z-50 shadow-md">
          {item.title}
        </div>
      )}
    </div>
  );
}

export default function RoleSidebar({ role = 'employer', collapsed = false }) {
  const loc = useLocation();
  const menu = MENUS[role] || MENUS['applicant'];

  return (
    <div
      className={`h-full flex flex-col px-2 py-3 ${
        collapsed ? 'items-center' : ''
      }`}
    >
      {/* Menu items */}
      <nav
        className={`flex-1 ${
          collapsed ? 'space-y-2' : 'space-y-1'
        } flex flex-col items-stretch`}
      >
        {menu.map((it) => {
          const active = loc.pathname === it.to;
          return (
            <MenuItem
              key={it.id}
              item={it}
              active={active}
              collapsed={collapsed}
            />
          );
        })}
      </nav>

      {/* Bottom info (workspace) — still optional */}
      {!collapsed && (
        <div className="mt-6 pt-4 border-t text-xs text-slate-400">
          <div className="mb-1">Workspace</div>
          <div className="text-sm text-slate-600">Optimus Co.</div>
        </div>
      )}
    </div>
  );
}