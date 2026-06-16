"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { apiFetch } from "@/lib/api";
import {
  Loader2,
  Save,
  AlertCircle,
  Briefcase,
  MapPin,
  Plus,
  X,
  ArrowLeft,
} from "lucide-react";
import { SingleJobResponse } from "@/types/job";

type FormState = {
  title: string;
  description: string;
  category: string;
  location: string;
  jobType: string;
  workMode: string;
  vacancies: number;
  salaryMin: string;
  salaryMax: string;
  experienceLevel: string;
  experienceYears: number;
  applicationDeadline: string;
};

export default function EditJobPage() {
  const router = useRouter();
  const params = useParams();
  const jobId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState<FormState>({
    title: "",
    description: "",
    category: "SOFTWARE_DEVELOPMENT",
    location: "",
    jobType: "FULL_TIME",
    workMode: "REMOTE",
    vacancies: 1,
    salaryMin: "",
    salaryMax: "",
    experienceLevel: "FRESHER",
    experienceYears: 0,
    applicationDeadline: "",
  });

  const [skills, setSkills] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);

  const [skillInput, setSkillInput] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadJob = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await apiFetch<SingleJobResponse>(`/jobs/${jobId}`);

        const job = response.job;

        if (!job) {
          throw new Error("Target job data was not found on the system.");
        }

        if (!isActive) {
          return;
        }

        setForm({
          title: job.title || "",
          description: job.description || "",
          category: job.category || "SOFTWARE_DEVELOPMENT",
          location: job.location || "",
          jobType: job.jobType || "FULL_TIME",
          workMode: job.workMode || "REMOTE",
          vacancies: job.vacancies || 1,
          salaryMin: job.salaryMin ? String(job.salaryMin) : "",
          salaryMax: job.salaryMax ? String(job.salaryMax) : "",
          experienceLevel: job.experienceLevel || "FRESHER",
          experienceYears: job.experienceYears || 0,
          applicationDeadline: job.applicationDeadline
            ? new Date(job.applicationDeadline).toISOString().split("T")[0]
            : "",
        });

        setSkills(job.skills || []);
        setRequirements(job.requirements || []);
        setBenefits(job.benefits || []);
      } catch (err: unknown) {
        if (isActive) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load job resource data.",
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    if (jobId) {
      void loadJob();
    }

    return () => {
      isActive = false;
    };
  }, [jobId]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addTag = (type: "skills" | "requirements" | "benefits") => {
    if (type === "skills" && skillInput.trim()) {
      if (!skills.includes(skillInput.trim()))
        setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
    if (type === "requirements" && requirementInput.trim()) {
      if (!requirements.includes(requirementInput.trim()))
        setRequirements([...requirements, requirementInput.trim()]);
      setRequirementInput("");
    }
    if (type === "benefits" && benefitInput.trim()) {
      if (!benefits.includes(benefitInput.trim()))
        setBenefits([...benefits, benefitInput.trim()]);
      setBenefitInput("");
    }
  };

  const removeTag = (
    type: "skills" | "requirements" | "benefits",
    index: number,
  ) => {
    if (type === "skills") setSkills(skills.filter((_, i) => i !== index));
    if (type === "requirements")
      setRequirements(requirements.filter((_, i) => i !== index));
    if (type === "benefits")
      setBenefits(benefits.filter((_, i) => i !== index));
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (
      form.salaryMin &&
      form.salaryMax &&
      Number(form.salaryMin) > Number(form.salaryMax)
    ) {
      setError(
        "Minimum salary range threshold cannot exceed specified maximum ceiling.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const payload = {
        ...form,
        vacancies: Number(form.vacancies),
        experienceYears: Number(form.experienceYears),
        salaryMin: form.salaryMin ? Number(form.salaryMin) : null,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : null,
        skills,
        requirements,
        benefits,
        applicationDeadline: form.applicationDeadline
          ? new Date(form.applicationDeadline).toISOString()
          : null,
      };

      await apiFetch(`/jobs/${jobId}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      router.push("/admin/dashboard/jobs");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update target job specifications.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-[#08a4a3]" />
      </div>
    );
  }

  // Consistent styles for input fields
  const inputStyles =
    "w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-800 placeholder:text-slate-400 focus:border-[#08a4a3] focus:ring-1 focus:ring-[#08a4a3] focus:outline-none transition shadow-xs";

  return (
    <div className="mx-auto max-w-4xl pb-16 px-4 md:px-0">
      {/* Header Summary */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#272d68] tracking-tight">
            Modify Job Parameters
          </h1>
          <p className="text-[#272d68]/60 text-sm font-medium mt-1">
            Review and update live system job values below.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push("/admin/dashboard/jobs")}
          className="flex items-center gap-2 text-xs font-bold text-[#272d68]/60 hover:text-[#272d68] transition self-start sm:self-center"
        >
          <ArrowLeft className="h-4 w-4" /> Back to listings
        </button>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-xs"
      >
        {/* SECTION 1: CORE SPECS */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#272d68]/70 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#08a4a3]" /> Core Definition
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1">
                Job Title
              </label>
              <input
                name="title"
                required
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. Senior Frontend Engineer"
                className={inputStyles}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1">
                Category
              </label>

              <select
                name="category"
                value={form.category || "SOFTWARE_DEVELOPMENT"}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="SOFTWARE_DEVELOPMENT">
                  Software Development
                </option>
                <option value="DATA_SCIENCE">Data Science</option>
                <option value="AI_ML">AI / ML</option>
                <option value="DEVOPS">DevOps</option>
                <option value="CYBER_SECURITY">Cyber Security</option>

                <option value="PRODUCT_MANAGEMENT">Product Management</option>
                <option value="PROJECT_MANAGEMENT">Project Management</option>

                <option value="DESIGN">Design</option>
                <option value="UI_UX_DESIGN">UI / UX Design</option>

                <option value="MARKETING">Marketing</option>
                <option value="DIGITAL_MARKETING">Digital Marketing</option>
                <option value="CONTENT_WRITING">Content Writing</option>
                <option value="SEO">SEO</option>

                <option value="SALES">Sales</option>
                <option value="BUSINESS_DEVELOPMENT">
                  Business Development
                </option>
                <option value="CUSTOMER_SUPPORT">Customer Support</option>

                <option value="HR">HR</option>
                <option value="RECRUITMENT">Recruitment</option>

                <option value="FINANCE">Finance</option>
                <option value="ACCOUNTING">Accounting</option>
                <option value="BANKING">Banking</option>
                <option value="INVESTMENT">Investment</option>

                <option value="OPERATIONS">Operations</option>
                <option value="SUPPLY_CHAIN">Supply Chain</option>
                <option value="LOGISTICS">Logistics</option>

                <option value="LEGAL">Legal</option>
                <option value="CONSULTING">Consulting</option>

                <option value="EDUCATION">Education</option>
                <option value="TRAINING">Training</option>

                <option value="HEALTHCARE">Healthcare</option>
                <option value="PHARMACEUTICAL">Pharmaceutical</option>

                <option value="MECHANICAL_ENGINEERING">
                  Mechanical Engineering
                </option>
                <option value="ELECTRICAL_ENGINEERING">
                  Electrical Engineering
                </option>
                <option value="CIVIL_ENGINEERING">Civil Engineering</option>

                <option value="AUTOMOBILE">Automobile</option>

                <option value="TELECOMMUNICATION">Telecommunication</option>

                <option value="MEDIA">Media / Entertainment</option>
                <option value="JOURNALISM">Journalism</option>

                <option value="HOSPITALITY">Hospitality</option>
                <option value="TRAVEL_TOURISM">Travel & Tourism</option>

                <option value="REAL_ESTATE">Real Estate</option>

                <option value="GOVERNMENT">Government</option>

                <option value="INTERNSHIP">Internship</option>

                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#272d68]/70 mb-1">
              Description
            </label>
            <textarea
              name="description"
              required
              value={form.description}
              onChange={handleChange}
              rows={5}
              placeholder="Provide a detailed overview of the core responsibilities..."
              className={inputStyles}
            />
          </div>
        </div>

        {/* SECTION 2: LOGISTICS */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#272d68]/70 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#08a4a3]" /> Environment Logistics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1">
                Location
              </label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
                placeholder="e.g. Mumbai, India"
                className={inputStyles}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1">
                Job Type
              </label>
              <select
                name="jobType"
                value={form.jobType}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1">
                Work Mode
              </label>
              <select
                name="workMode"
                value={form.workMode}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="REMOTE">Remote</option>
                <option value="ONSITE">Onsite</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1">
                Vacancies
              </label>
              <input
                name="vacancies"
                type="number"
                min={1}
                value={form.vacancies}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1">
                Experience Tier
              </label>
              <select
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="FRESHER">Fresher</option>
                <option value="JUNIOR">Junior</option>
                <option value="MID">Mid Level</option>
                <option value="SENIOR">Senior</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1">
                Required Years
              </label>
              <input
                name="experienceYears"
                type="number"
                min={0}
                value={form.experienceYears}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
          </div>
        </div>

        {/* SECTION 3: COMP / DATES */}
        <div className="space-y-4 pt-4 border-t border-slate-100">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#272d68]/70 flex items-center gap-2">
            Compensation & Terminus
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1">
                Min Salary ($)
              </label>
              <input
                name="salaryMin"
                type="number"
                value={form.salaryMin}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1">
                Max Salary ($)
              </label>
              <input
                name="salaryMax"
                type="number"
                value={form.salaryMax}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1">
                Application Deadline
              </label>
              <input
                type="date"
                name="applicationDeadline"
                value={form.applicationDeadline}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
          </div>
        </div>

        {/* SECTION 4: TAG ARRAY GENERATORS WITH SLATE CLUSTERS */}
        <div className="space-y-6 pt-6 border-t border-slate-100">
          {/* SKILLS */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
            <label className="block text-xs font-bold text-[#272d68] mb-1.5">
              Skills Required
            </label>
            <div className="mb-3 flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag("skills"))
                }
                placeholder="Type skill and press enter..."
                className="flex-1 rounded-xl border border-slate-200 bg-white p-2.5 text-sm focus:border-[#08a4a3] focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => addTag("skills")}
                className="rounded-xl bg-[#272d68] hover:bg-[#272d68]/90 px-4 text-white transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#ceeeed]/50 border border-[#08a4a3]/20 px-3 py-1 text-xs font-bold text-[#08a4a3]"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeTag("skills", idx)}
                    className="hover:text-rose-600 transition p-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* REQUIREMENTS */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
            <label className="block text-xs font-bold text-[#272d68] mb-1.5">
              Mandatory Requirements
            </label>
            <div className="mb-3 flex gap-2">
              <input
                value={requirementInput}
                onChange={(e) => setRequirementInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), addTag("requirements"))
                }
                placeholder="Type dynamic requirement and press enter..."
                className="flex-1 rounded-xl border border-slate-200 bg-white p-2.5 text-sm focus:border-[#08a4a3] focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => addTag("requirements")}
                className="rounded-xl bg-[#272d68] hover:bg-[#272d68]/90 px-4 text-white transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {requirements.map((req, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-slate-200/70 border border-slate-300 px-3 py-1 text-xs font-bold text-slate-700"
                >
                  {req}
                  <button
                    type="button"
                    onClick={() => removeTag("requirements", idx)}
                    className="hover:text-rose-600 transition p-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* BENEFITS */}
          <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl">
            <label className="block text-xs font-bold text-[#272d68] mb-1.5">
              Perks & Benefits Offered
            </label>
            <div className="mb-3 flex gap-2">
              <input
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag("benefits"))
                }
                placeholder="e.g. Health Insurance"
                className="flex-1 rounded-xl border border-slate-200 bg-white p-2.5 text-sm focus:border-[#08a4a3] focus:outline-none transition"
              />
              <button
                type="button"
                onClick={() => addTag("benefits")}
                className="rounded-xl bg-[#272d68] hover:bg-[#272d68]/90 px-4 text-white transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {benefits.map((benefit, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-bold text-blue-600"
                >
                  {benefit}
                  <button
                    type="button"
                    onClick={() => removeTag("benefits", idx)}
                    className="hover:text-rose-600 transition p-0"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* BOTTOM PANEL ROW */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.push("/admin/dashboard/jobs")}
            className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-[#272d68]/70 hover:bg-slate-50 transition w-full sm:w-auto"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center justify-center gap-2 rounded-xl bg-[#08a4a3] px-8 py-3 text-sm font-bold text-white hover:bg-[#08a4a3]/90 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm w-full sm:w-auto"
          >
            {saving ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Save className="h-4 w-4" />
            )}
            {saving ? "Committing Updates..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
