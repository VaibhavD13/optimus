// frontend/src/ui/TopHeader.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MagnifyingGlassIcon,
  ArrowPathIcon,
  SunIcon,
  ChevronDownIcon,
  BellAlertIcon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import Avatar from "react-avatar";
import { useLocation, useNavigate } from "react-router-dom";
import { MENUS } from "../config/menu";

/**
 * TopHeader (updated)
 *
 * Props:
 *  - onToggleLeft()
 *  - onToggleRight()
 *  - leftCollapsed (bool)
 *  - rightCollapsed (bool)
 *  - onSearch(query)
 *  - onThemeToggle(theme)
 *  - onRefresh()
 *  - onReminderClick()
 *
 * Notes:
 *  - Uses RectangleGroupIcon for both toggles (matches reference)
 *  - Animates icons with framer-motion (rotate)
 *  - Debounced search + enter-to-submit
 *  - Avatar menu (Profile / Settings / Logout)
 */
export default function TopHeader({
  onToggleLeft = () => {},
  onToggleRight = () => {},
  leftCollapsed = false,
  rightCollapsed = false,
  onSearch = () => {},
  onThemeToggle = () => {},
  onRefresh = () => {},
  onReminderClick = null,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const debounceRef = useRef(null);
  const [theme, setTheme] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light"
  );

  const [reminderOpen, setReminderOpen] = useState(false);
  const [avatarOpen, setAvatarOpen] = useState(false);

  // Determine friendly page title from MENUS
  const pageTitle = useMemo(() => {
    const path = location.pathname || "/";
    for (const roleKey of Object.keys(MENUS)) {
      for (const item of MENUS[roleKey]) {
        if (!item?.to) continue;
        if (item.to === path) return item.title;
        if (path.startsWith(item.to + "/")) return item.title;
      }
    }
    const seg = path.split("/").filter(Boolean).pop() || "Dashboard";
    return seg[0].toUpperCase() + seg.slice(1);
  }, [location.pathname]);

  // Debounced search
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onSearch(query.trim());
      debounceRef.current = null;
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, onSearch]);

  function submitSearch() {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    onSearch(query.trim());
  }

  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    if (typeof document !== "undefined") {
      document.documentElement.classList.toggle("dark", next === "dark");
    }
    onThemeToggle(next);
  }

  function handleRefresh() {
    if (typeof onRefresh === "function") {
      onRefresh();
    } else {
      window.dispatchEvent(new CustomEvent("refreshData"));
    }
  }

  function handleReminderClick() {
    if (onReminderClick) onReminderClick();
    setReminderOpen((s) => !s);
  }

  // Close dropdowns on outside click
  useEffect(() => {
    function onDocClick(e) {
      const target = /** @type {HTMLElement} */ (e.target);
      if (!target || !target.closest) return;
      if (avatarOpen && !target.closest("#topheader-avatar-menu")) setAvatarOpen(false);
      if (reminderOpen && !target.closest("#topheader-reminder-menu") && !target.closest("#topheader-reminder-btn")) setReminderOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, [avatarOpen, reminderOpen]);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto flex items-center gap-4 px-3 py-2">
        {/* Left: toggle + small brand */}
        <div className="flex items-center gap-2 w-56">
          <button
            onClick={onToggleLeft}
            aria-label="Toggle left sidebar"
            className="p-1.5 rounded-md hover:bg-gray-100"
          >
            <motion.div
              animate={{ rotate: leftCollapsed ? 180 : 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{ display: "inline-block" }}
            >
              <RectangleGroupIcon className="h-5 w-5 text-slate-600" />
            </motion.div>
          </button>

          <div className="hidden sm:flex items-center gap-2">
            <Avatar name="Optimus" size="28" round />
            <div className="text-sm font-semibold text-slate-800">Optimus</div>
          </div>
        </div>

        {/* Center: page title + search */}
        <div className="flex-1 flex items-center gap-4">
          <div className="text-sm text-slate-600 font-medium">{pageTitle}</div>

          <div className="flex-1 max-w-xl">
            <div className="flex items-center bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") submitSearch(); }}
                className="ml-2 bg-transparent text-sm outline-none w-full"
                placeholder="Search jobs, candidates, companies..."
                aria-label="Search"
              />
              <button onClick={submitSearch} aria-label="Search submit" className="text-xs text-gray-400 ml-2 px-2 py-1 rounded hover:bg-gray-100">
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-2 w-64 justify-end">
          <button
            onClick={toggleTheme}
            title="Toggle theme"
            className="p-1.5 rounded-md hover:bg-gray-100"
            aria-pressed={theme === "dark"}
          >
            <SunIcon className="h-5 w-5 text-slate-600" />
          </button>

          <button
            onClick={handleRefresh}
            title="Refresh data"
            className="p-1.5 rounded-md hover:bg-gray-100"
          >
            <ArrowPathIcon className="h-5 w-5 text-slate-600" />
          </button>

          <div className="relative">
            <button
              id="topheader-reminder-btn"
              onClick={handleReminderClick}
              title="Reminders"
              className="p-1.5 rounded-md hover:bg-gray-100"
              aria-expanded={reminderOpen}
            >
              <BellAlertIcon className="h-5 w-5 text-slate-600" />
            </button>

            {reminderOpen && (
              <div id="topheader-reminder-menu" className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg z-50">
                <div className="p-3 text-sm text-slate-700">
                  <div className="font-semibold mb-1">Reminders</div>
                  <div className="text-xs text-slate-500">You have 2 reminders</div>
                </div>
                <div className="divide-y">
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">Interview with Rahul — Tomorrow 10:00</button>
                  <button className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">Follow up: Candidate #23</button>
                </div>
                <div className="p-2 text-xs text-center text-slate-500">Manage reminders</div>
              </div>
            )}
          </div>

          {/* Right toggle uses same icon - mirrored via rotation animation */}
          <button onClick={onToggleRight} className="p-1.5 rounded-md hover:bg-gray-100" aria-label="Toggle right panel">
            <motion.div
              animate={{ rotate: rightCollapsed ? 180 : 0 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              style={{ display: "inline-block" }}
            >
              {/* rotate here gives mirrored/animated feel */}
              <RectangleGroupIcon className="h-5 w-5 text-slate-600" />
            </motion.div>
          </button>

          {/* Avatar + menu */}
          <div className="relative" id="topheader-avatar-menu">
            <button
              onClick={() => setAvatarOpen((s) => !s)}
              className="flex items-center gap-2 p-1.5 rounded-md hover:bg-gray-100"
              aria-expanded={avatarOpen}
            >
              <Avatar name="Vaibhav D" size="28" round />
              <ChevronDownIcon className="h-4 w-4 text-slate-600" />
            </button>

            {avatarOpen && (
              <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg z-50">
                <button onClick={() => { setAvatarOpen(false); navigate('/profile'); }} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">Profile</button>
                <button onClick={() => { setAvatarOpen(false); navigate('/settings'); }} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm">Settings</button>
                <div className="border-t" />
                <button onClick={() => { setAvatarOpen(false); /* TODO: call logout */ alert('Logout (TODO)'); }} className="w-full text-left px-3 py-2 hover:bg-gray-50 text-sm text-red-600">Logout</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}