// frontend/src/pages/EmployerJobs.jsx
import React, { useState, useMemo, useEffect, forwardRef, useImperativeHandle } from "react";
import { useAuth } from "../context/AuthContext";
import Layout from "../ui/Layout";
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
  PencilSquareIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

/* ---------------- ConfirmModal ---------------- */
/* ---------------- ConfirmModal ---------------- */
function ConfirmModal({ open, title, message, confirmLabel = "Confirm", onCancel, onConfirm }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
        <h3 className="text-lg font-semibold mb-2 text-slate-800">{title}</h3>
        <p className="text-sm text-slate-600 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl bg-rose-500 text-white hover:bg-rose-600 text-sm font-medium shadow-sm"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- JobDrawer (Add/Edit) ----------------
   - Requests actions instead of applying them directly.
   - Parent confirms then applies changes and signals close.
*/
const JobDrawer = forwardRef(function JobDrawer({ jobData, closeSignal, onRequestSubmit, onRequestClose, onCloseComplete }, ref) {
  const isEdit = !!jobData;
  const initial = jobData || {
    title: "",
    location: "",
    employmentType: "",
    salaryRange: "",
    jobDescription: "",
    skills: "",
    isPublished: false,
  };

  const [job, setJob] = useState(initial);
  const [errors, setErrors] = useState({});
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setJob(initial);
    setErrors({});
  }, [jobData]);

  // if parent signals close (after confirm), play closing animation then call onCloseComplete
  useEffect(() => {
    if (closeSignal) {
      setClosing(true);
      const t = setTimeout(() => {
        onCloseComplete?.();
      }, 500);
      return () => clearTimeout(t);
    }
  }, [closeSignal, onCloseComplete]);

  // Expose simple imperative method to get dirty status if parent wants (not used)
  useImperativeHandle(ref, () => ({
    isDirty: () => JSON.stringify(job) !== JSON.stringify(initial),
  }));

  function handleChange(e) {
    const { name, value } = e.target;
    setJob(p => ({ ...p, [name]: value }));
  }

  function validate() {
    const e = {};
    if (!job.title || job.title.trim().length < 3) e.title = "Title required (min 3 chars)";
    if (!job.location || job.location.trim().length < 2) e.location = "Location required";
    if (!job.jobDescription || job.jobDescription.trim().length < 10) e.jobDescription = "Description required (min 10 chars)";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  // user tries to close (X / Cancel)
  function handleRequestClose() {
    const isDirty = JSON.stringify(job) !== JSON.stringify(initial);
    onRequestClose?.(isDirty);
  }

  // user clicks save draft / publish -> request parent to confirm
  function handleRequestSubmit(publish) {
    if (!validate()) return;
    const payload = { ...job, isPublished: publish };
    onRequestSubmit?.(payload, isEdit, publish ? "publish" : "draft");
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-end z-50" aria-modal="true">
      <div
        className={`bg-white w-full sm:w-[600px] h-full shadow-2xl flex flex-col ${closing ? "animate-slideOutRight" : "animate-slideInRight"}`}
        role="dialog"
        aria-label={isEdit ? "Edit job" : "Post new job"}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h3 className="text-lg font-semibold text-slate-800">{isEdit ? "Edit Job" : "Post New Job"}</h3>
          <button onClick={handleRequestClose} className="p-2 hover:bg-gray-100 rounded-full text-slate-500" aria-label="close">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Job Title <span className="text-red-500">*</span></label>
            <input name="title" value={job.title} onChange={handleChange}
              className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ${errors.title ? "border-rose-300 ring-rose-200" : "focus:ring-optimus-blue-500"}`}
              placeholder="e.g., Backend Developer" />
            {errors.title && <div className="text-rose-600 text-xs mt-1">{errors.title}</div>}
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Location <span className="text-red-500">*</span></label>
            <input name="location" value={job.location} onChange={handleChange}
              className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ${errors.location ? "border-rose-300 ring-rose-200" : "focus:ring-optimus-blue-500"}`}
              placeholder="e.g., Pune / Remote" />
            {errors.location && <div className="text-rose-600 text-xs mt-1">{errors.location}</div>}
          </div>

          {/* Employment & Salary */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Employment Type</label>
              <select name="employmentType" value={job.employmentType} onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-optimus-blue-500">
                <option value="">Select</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Remote">Remote</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Salary Range</label>
              <input name="salaryRange" value={job.salaryRange} onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-optimus-blue-500"
                placeholder="e.g., 8 LPA - 12 LPA" />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Job Description <span className="text-red-500">*</span></label>
            <textarea name="jobDescription" value={job.jobDescription} onChange={handleChange} rows="5"
              className={`w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 ${errors.jobDescription ? "border-rose-300 ring-rose-200" : "focus:ring-optimus-blue-500"}`}
              placeholder="Describe responsibilities, requirements..." />
            {errors.jobDescription && <div className="text-rose-600 text-xs mt-1">{errors.jobDescription}</div>}
          </div>

          {/* Skills */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">Required Skills (comma separated)</label>
            <input name="skills" value={job.skills} onChange={handleChange}
              placeholder="e.g., React, Node.js, AWS"
              className="w-full border rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-optimus-blue-500" />
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end gap-3 bg-gray-50">
          <button onClick={handleRequestClose} className="px-4 py-2 rounded-xl border bg-white hover:bg-gray-100 text-sm">Cancel</button>
          <button onClick={() => { if (!validate()) return; onRequestSubmit?.({ ...job, isPublished: false }, isEdit, "draft"); }} className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-sm">Save Draft</button>
          <button onClick={() => { if (!validate()) return; onRequestSubmit?.({ ...job, isPublished: true }, isEdit, "publish"); }} className="px-4 py-2 rounded-xl bg-optimus-blue-600 text-white hover:bg-optimus-blue-700 text-sm">{isEdit ? "Update Job" : "Publish Job"}</button>
        </div>
      </div>
    </div>
  );
});

/* ---------------- Main Page ---------------- */
export default function EmployerJobs() {
  const { user } = useAuth();

  const [jobs, setJobs] = useState([
    { id: 1, title: "Backend Developer", location: "Pune", employmentType: "Full-time", applicants: 24, status: "Published", date: "2025-11-09" },
    { id: 2, title: "Frontend Engineer", location: "Bangalore", employmentType: "Remote", applicants: 15, status: "Draft", date: "2025-11-10" },
  ]);

  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerJob, setDrawerJob] = useState(null);
  const [drawerCloseSignal, setDrawerCloseSignal] = useState(false);

  const [confirm, setConfirm] = useState({ open: false, title: "", message: "", confirmLabel: "Confirm", onConfirm: null });

  const [searchFilters, setSearchFilters] = useState({ title: "", location: "", employmentType: "", status: "" });
  const [globalSearch, setGlobalSearch] = useState("");

  // filtering
  const filteredJobs = useMemo(() => {
    return jobs.filter(j => {
      const global = Object.values(j).join(" ").toLowerCase().includes(globalSearch.toLowerCase());
      const byFilters = Object.entries(searchFilters).every(([k, v]) => String(j[k] ?? "").toLowerCase().includes(v.toLowerCase()));
      return global && byFilters;
    });
  }, [jobs, globalSearch, searchFilters]);

  /* ---- Confirmation helpers ---- */
  function showConfirmation({ title, message, confirmLabel = "Confirm", onConfirm }) {
    setConfirm({ open: true, title, message, confirmLabel, onConfirm });
  }
  function hideConfirmation() { setConfirm({ open: false, title: "", message: "", confirmLabel: "Confirm", onConfirm: null }); }

  /* ---- Drawer flow: user requests submit or close -> parent shows confirm -> on confirm apply and close drawer ---- */
  // called by JobDrawer when user clicks Save/Publish
  function handleDrawerRequestSubmit(payload, isEdit, action) {
    // action = "publish" | "draft"
    const verb = action === "publish" ? (isEdit ? "update and publish" : "publish") : (isEdit ? "update as draft" : "save as draft");
    showConfirmation({
      title: `${action === "publish" ? (isEdit ? "Confirm update & publish" : "Confirm publish") : (isEdit ? "Confirm update" : "Save draft")}`,
      message: `Are you sure you want to ${verb} this job?`,
      confirmLabel: action === "publish" ? (isEdit ? "Update & Publish" : "Publish") : (isEdit ? "Update" : "Save"),
      onConfirm: () => {
        // apply change
        if (isEdit) {
          setJobs(prev => prev.map(j => j.id === drawerJob.id ? { ...j, ...payload, status: payload.isPublished ? "Published" : "Draft" } : j));
        } else {
          setJobs(prev => [...prev, { id: prev.length + 1, ...payload, applicants: 0, status: payload.isPublished ? "Published" : "Draft", date: new Date().toISOString().split("T")[0] }]);
        }
        hideConfirmation();
        // instruct drawer to animate out; parent will unmount when drawer calls onCloseComplete
        setDrawerCloseSignal(true);
      }
    });
  }

  // called by JobDrawer when user tries to close; isDirty tells if there are changes
  function handleDrawerRequestClose(isDirty) {
    if (!isDirty) {
      // no changes -> close immediately (play animation)
      setDrawerCloseSignal(true);
      return;
    }
    // confirm discard changes
    showConfirmation({
      title: "Discard changes?",
      message: "You have unsaved changes. Are you sure you want to discard them?",
      confirmLabel: "Discard",
      onConfirm: () => {
        hideConfirmation();
        setDrawerCloseSignal(true);
      }
    });
  }

  // drawer notifies that close animation finished -> unmount
  function handleDrawerCloseComplete() {
    setShowDrawer(false);
    setDrawerJob(null);
    setDrawerCloseSignal(false);
  }

  /* ---- Table actions: delete, publish/unpublish ---- */
  function requestDelete(job) {
    showConfirmation({
      title: "Delete job?",
      message: `Delete "${job.title}" permanently? This cannot be undone.`,
      confirmLabel: "Delete",
      onConfirm: () => {
        setJobs(prev => prev.filter(j => j.id !== job.id));
        hideConfirmation();
      }
    });
  }

  function requestTogglePublish(job) {
    const willPublish = job.status !== "Published";
    showConfirmation({
      title: willPublish ? "Publish job?" : "Unpublish job?",
      message: willPublish ? `Publish "${job.title}" now?` : `Unpublish "${job.title}"? Applicants will no longer see it.`,
      confirmLabel: willPublish ? "Publish" : "Unpublish",
      onConfirm: () => {
        setJobs(prev => prev.map(j => j.id === job.id ? { ...j, status: willPublish ? "Published" : "Draft" } : j));
        hideConfirmation();
      }
    });
  }

  /* ---- Open add / edit drawers ---- */
  function openAddDrawer() {
    setDrawerJob(null);
    setShowDrawer(true);
    setDrawerCloseSignal(false);
  }
  function openEditDrawer(job) {
    setDrawerJob(job);
    setShowDrawer(true);
    setDrawerCloseSignal(false);
  }

  return (
    <Layout showRightPanel={false}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Job Listings</h2>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border rounded-xl px-3 py-1.5 shadow-sm">
            <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            <input type="text" placeholder="Search jobs..." value={globalSearch} onChange={(e) => setGlobalSearch(e.target.value)} className="outline-none px-2 text-sm" />
          </div>

          <button onClick={openAddDrawer} className="flex items-center gap-2 bg-optimus-blue-600 text-white px-4 py-2 rounded-xl hover:bg-optimus-blue-700 transition">
            <PlusCircleIcon className="h-5 w-5" />
            <span>Post New Job</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm p-6 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-500 border-b">
              {["title", "location", "employmentType", "status", "date"].map(col => (
                <th key={col} className="pb-3">
                  <div className="flex flex-col">
                    <span className="capitalize mb-1">{col}</span>
                    <input type="text" placeholder={`Search ${col}`} value={searchFilters[col] || ""} onChange={(e) => setSearchFilters({ ...searchFilters, [col]: e.target.value })} className="border rounded-md px-2 py-1 text-xs outline-none focus:ring-1 focus:ring-optimus-blue-500" />
                  </div>
                </th>
              ))}
              <th className="pb-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredJobs.length > 0 ? filteredJobs.map(job => (
              <tr key={job.id} className="border-b last:border-none hover:bg-gray-50 transition">
                <td className="py-3 font-medium text-slate-700">{job.title}</td>
                <td className="py-3">{job.location}</td>
                <td className="py-3">{job.employmentType}</td>
                <td className="py-3">
                  <span className={`px-3 py-1 rounded-full text-xs ${job.status === "Published" ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"}`}>{job.status}</span>
                </td>
                <td className="py-3 text-slate-500">{new Date(job.date).toLocaleDateString("en-GB")}</td>

                <td className="py-3 text-center flex justify-center gap-2">
                  <button onClick={() => openEditDrawer(job)} className="p-2 hover:bg-gray-100 rounded-md" title="Edit"><PencilSquareIcon className="h-5 w-5 text-slate-600" /></button>

                  <button onClick={() => requestTogglePublish(job)} className="p-2 hover:bg-gray-100 rounded-md" title={job.status === "Published" ? "Unpublish" : "Publish"}>
                    {job.status === "Published" ? <XCircleIcon className="h-5 w-5 text-red-500" /> : <CheckCircleIcon className="h-5 w-5 text-green-500" />}
                  </button>

                  <button onClick={() => requestDelete(job)} className="p-2 hover:bg-gray-100 rounded-md" title="Delete"><TrashIcon className="h-5 w-5 text-rose-500" /></button>
                </td>
              </tr>
            )) : (
              <tr><td colSpan="6" className="text-center py-6 text-slate-500 italic">No matching jobs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Drawer (Add/Edit) */}
      {showDrawer && (
        <JobDrawer
          jobData={drawerJob}
          closeSignal={drawerCloseSignal}
          onRequestSubmit={handleDrawerRequestSubmit}
          onRequestClose={handleDrawerRequestClose}
          onCloseComplete={handleDrawerCloseComplete}
        />
      )}

      {/* Confirm modal (single source) */}
      <ConfirmModal
        open={confirm.open}
        title={confirm.title}
        message={confirm.message}
        confirmLabel={confirm.confirmLabel}
        onCancel={() => hideConfirmation()}
        onConfirm={() => {
          // call the stored onConfirm callback (if any)
          confirm.onConfirm?.();
        }}
      />
    </Layout>
  );
}