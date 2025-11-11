// frontend/src/ui/Layout.jsx
import React from 'react';
import RoleSidebar from './RoleSidebar';
import RoleRightPanel from './RoleRightPanel';
import TopHeader from './TopHeader';
import { useAuth } from '../context/AuthContext';
import clsx from 'clsx';
import { ToastProvider } from './ToastProvider'; // ✅ added

/**
 * Layout controls widths for left / main / right using flex.
 * leftCollapsed/rightCollapsed should be booleans.
 * leftWidth/rightWidth are applied dynamically.
 */
export default function Layout({
  children,
  showRightPanel = false,
  leftCollapsed = false,
  rightCollapsed = false,
  onToggleLeft = null,
  onToggleRight = null,
}) {
  const { user } = useAuth();
  const role = (user?.Role || 'applicant').toLowerCase();

  // width classes when expanded vs collapsed
  const leftWidthClass = leftCollapsed ? 'w-13' : 'w-62';
  const rightWidthClass = rightCollapsed ? 'w-16' : 'w-70';

  return (
    <ToastProvider> {/* ✅ ToastProvider wraps the entire layout */}
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <TopHeader onToggleLeft={onToggleLeft} onToggleRight={onToggleRight} />

        <div className="flex flex-1 overflow-hidden">
          {/* Left sidebar container - Layout manages width */}
          <div
            className={clsx(
              'hidden md:flex flex-col shrink-0 overflow-hidden bg-white border-r transition-width duration-200 ease-in-out',
              leftWidthClass
            )}
            aria-hidden={false}
          >
            <RoleSidebar role={role} collapsed={leftCollapsed} />
          </div>

          {/* Main content - flexes to fill remaining space */}
          <main className="flex-1 min-w-0 p-6 overflow-auto" role="main">
            {children}
          </main>

          {/* Right sidebar container - keep in DOM and shrink to rightCollapsed width */}
          {showRightPanel && (
            <div
              className={clsx(
                'hidden lg:flex flex-col shrink-0 overflow-hidden bg-white border-l transition-width duration-200 ease-in-out',
                rightWidthClass
              )}
              aria-hidden={false}
            >
              <RoleRightPanel role={role} collapsed={rightCollapsed} />
            </div>
          )}
        </div>
      </div>
    </ToastProvider>
  );
}