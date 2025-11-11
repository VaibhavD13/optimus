// frontend/src/ui/RoleSidebar.jsx
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MENUS } from "../config/menu";

/**
 * Animated RoleSidebar (brand removed)
 * props:
 *  - role: 'employer' | 'admin' | 'applicant'
 *  - collapsed: boolean (icon-only narrow mode)
 *
 * Uses inline width style plus .transition-width for smooth slide animation.
 * Tooltips still appear for each icon when collapsed.
 */
export default function RoleSidebar({ role = "employer", collapsed = false }) {
  const menu = MENUS[role] || MENUS["applicant"];
  const loc = useLocation();

  // widths (adjust these if you want smaller/larger sidebars)
  const expandedWidth = "15rem"; // 16rem = 256px
  const collapsedWidth = "4rem"; // 4rem = 64px

  return (
    <aside
      className="bg-white border-r min-h-screen py-4 hidden md:flex flex-col transition-width"
      style={{ width: collapsed ? collapsedWidth : expandedWidth }}
      aria-hidden={false}
    >
      <div className="px-2">
        {/* NAV - no branding at top */}
        <nav className="flex-1 flex flex-col gap-1">
          {menu.map((item) => {
            const Icon = item.icon;
            const active = loc.pathname === item.to;

            return (
              <div key={item.id} className="relative group">
                <Link
                  to={item.to}
                  className={`flex items-center gap-3 p-2 rounded-md transition-colors ${
                    active ? "bg-optimus-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  <div
                    className={`p-2 rounded-md shadow-sm flex items-center justify-center ${
                      active
                        ? "bg-optimus-blue-100 text-optimus-blue-600"
                        : "bg-white text-slate-600"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* label: fades out / shifts when collapsed */}
                  <div
                    className="sidebar-label text-sm text-slate-700 overflow-hidden"
                    style={{
                      opacity: collapsed ? 0 : 1,
                      transform: collapsed ? "translateX(-6px)" : "translateX(0)",
                      width: collapsed ? 0 : "auto",
                      whiteSpace: "nowrap",
                    }}
                    aria-hidden={collapsed}
                  >
                    {item.title}
                  </div>
                </Link>

                {/* Tooltip only visible in collapsed mode */}
                {collapsed && (
                  <div
                    className="absolute left-full top-1/2 -translate-y-1/2 px-3 py-1 rounded-md bg-gray-800 text-white text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 tooltip-fade pointer-events-none shadow-lg"
                    style={{ transform: "translateY(-50%)" }}
                  >
                    {item.title}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* bottom area: workspace info removed when collapsed; no branding text */}
        <div className="mt-auto pt-4 border-t text-xs text-slate-400 px-2">
          <div
            className="mb-1"
            style={{ opacity: collapsed ? 0 : 1, transition: "opacity 180ms" }}
          >
            {/* Optionally keep the label; here we keep a generic "Workspace" when expanded */}
            Workspace
          </div>
          {/* removed company name to avoid duplicate branding */}
        </div>
      </div>
    </aside>
  );
}