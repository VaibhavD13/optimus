import React, { useState } from "react";
import Layout from "../ui/Layout";
import { useAuth } from "../context/AuthContext";
import {
  BriefcaseIcon,
  MapPinIcon,
  CurrencyRupeeIcon,
  ListBulletIcon,
  CheckCircleIcon,
  ArrowLeftIcon,
  CloudArrowUpIcon,
} from "@heroicons/react/24/outline";

export default function PostNewJob() {
  const { user } = useAuth();
  const [job, setJob] = useState({
    title: "",
    location: "",
    employmentType: "",
    salaryRange: "",
    jobDescription: "",
    skills: "",
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async (publish = false) => {
    setSaving(true);
    try {
      // Later integrate with real backend:
      // await fetch(`/api/v1/jobs/${companyId}`, {...})
      console.log("Submitting job:", { ...job, isPublished: publish });
      alert(
        publish
          ? "Job published successfully ✅"
          : "Job saved as draft 💾"
      );
    } catch (err) {
      console.error(err);
      alert("Error saving job!");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Layout showRightPanel={false}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.history.back()}
              className="flex items-center gap-1 text-slate-600 hover:text-optimus-blue-600"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Back</span>
            </button>
          </div>
          <h2 className="text-2xl font-semibold text-slate-800">
            Post New Job
          </h2>
          <div></div>
        </div>

        {/* Job Details Card */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BriefcaseIcon className="h-5 w-5 text-optimus-blue-600" />
            Job Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Job Title <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                value={job.title}
                onChange={handleChange}
                placeholder="e.g., Backend Developer"
                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-optimus-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Location <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
                <MapPinIcon className="h-5 w-5 text-slate-400" />
                <input
                  name="location"
                  value={job.location}
                  onChange={handleChange}
                  placeholder="e.g., Pune / Remote"
                  className="w-full outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Employment Type
              </label>
              <select
                name="employmentType"
                value={job.employmentType}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-optimus-blue-500 outline-none"
              >
                <option value="">Select Type</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Internship">Internship</option>
                <option value="Contract">Contract</option>
                <option value="Remote">Remote</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">
                Salary Range (Optional)
              </label>
              <div className="flex items-center gap-2 border rounded-xl px-3 py-2">
                <CurrencyRupeeIcon className="h-5 w-5 text-slate-400" />
                <input
                  name="salaryRange"
                  value={job.salaryRange}
                  onChange={handleChange}
                  placeholder="e.g., 8 LPA - 12 LPA"
                  className="w-full outline-none text-sm"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ListBulletIcon className="h-5 w-5 text-optimus-blue-600" />
            Job Description & Skills
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Job Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="jobDescription"
              value={job.jobDescription}
              onChange={handleChange}
              placeholder="Describe the responsibilities, expectations, and qualifications..."
              rows="5"
              className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-optimus-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-600 mb-1">
              Required Skills (comma separated)
            </label>
            <input
              name="skills"
              value={job.skills}
              onChange={handleChange}
              placeholder="e.g., Node.js, React, AWS"
              className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-optimus-blue-500 outline-none"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            disabled={saving}
            onClick={() => handleSave(false)}
            className="flex items-center gap-2 px-5 py-2 rounded-xl border bg-white hover:bg-gray-50 text-sm font-medium"
          >
            <CloudArrowUpIcon className="h-5 w-5 text-slate-500" />
            Save Draft
          </button>
          <button
            disabled={saving}
            onClick={() => handleSave(true)}
            className="flex items-center gap-2 bg-optimus-blue-600 text-white px-5 py-2 rounded-xl hover:bg-optimus-blue-700 text-sm font-medium"
          >
            <CheckCircleIcon className="h-5 w-5" />
            {saving ? "Publishing..." : "Publish Job"}
          </button>
        </div>
      </div>
    </Layout>
  );
}