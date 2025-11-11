// frontend/src/ui/ToastProvider.jsx
import React, { createContext, useContext, useState, useCallback } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

/**
 * Simple toast provider (no external deps).
 * Usage:
 *   const toast = useToast();
 *   toast.success("Saved");
 */
const ToastContext = createContext(null);

let idCounter = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const push = useCallback((type, message, opts = {}) => {
    const id = idCounter++;
    const timeout = opts.duration ?? 4000;
    const t = { id, type, message, timeout };
    setToasts((s) => [t, ...s]);

    // auto remove
    setTimeout(() => {
      setToasts((s) => s.filter((x) => x.id !== id));
    }, timeout);

    return id;
  }, []);

  const remove = useCallback((id) => {
    setToasts((s) => s.filter((x) => x.id !== id));
  }, []);

  const api = {
    success: (msg, opts) => push("success", msg, opts),
    error: (msg, opts) => push("error", msg, opts),
    info: (msg, opts) => push("info", msg, opts),
    remove,
  };

  return (
    <ToastContext.Provider value={api}>
      {children}
      {/* Portal-ish top-right toasts */}
      <div className="fixed top-4 right-4 z-60 flex flex-col items-end gap-3">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`max-w-sm w-full rounded-lg shadow-lg px-4 py-3 flex items-start gap-3
              ${t.type === "success" ? "bg-emerald-50 ring-1 ring-emerald-200" : ""}
              ${t.type === "error" ? "bg-rose-50 ring-1 ring-rose-200" : ""}
              ${t.type === "info" ? "bg-slate-50 ring-1 ring-slate-200" : ""}`}
          >
            <div className="flex-1">
              <div className="text-sm font-medium text-slate-800">{t.type === "success" ? "Success" : t.type === "error" ? "Error" : "Info"}</div>
              <div className="text-xs text-slate-600 mt-0.5">{t.message}</div>
            </div>
            <button
              onClick={() => remove(t.id)}
              className="p-1 rounded-md text-slate-500 hover:text-slate-700"
              aria-label="dismiss"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const api = useContext(ToastContext);
  if (!api) throw new Error("useToast must be used inside ToastProvider");
  return api;
}