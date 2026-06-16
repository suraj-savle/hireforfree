"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import {
  MapPin,
  Briefcase,
  Clock,
  Loader2,
  AlertTriangle,
  Tag,
  ArrowLeft,
  Calendar,
  Award,
  Save,
  Plus,
  X,
} from "lucide-react";
import { SingleJobResponse } from "@/types/job";

interface Jobform {
  title: string;
  description: string;
  category: string;
  location: string;
  jobType: string;
  workMode: string;
  vacancies: number;
  salaryMin: number;
  salaryMax: number;
  salaryCurrency?: string;
  experienceLevel: string;
  experienceYears: number;
  skills: string[];
  requirements: string[]; // Strictly string array
  benefits: string[]; // Strictly string array
  applicationDeadline: string;
  status: string;
}

export default function JobEditPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  // Form rendering fields for requirements/benefits handle strings locally for direct text area editing
  const [form, setform] = useState<
    Omit<Jobform, "requirements" | "benefits"> & {
      requirements: string;
      benefits: string;
    }
  >({
    title: "",
    description: "",
    category: "",
    location: "",
    jobType: "FULL_TIME",
    workMode: "ONSITE",
    vacancies: 1,
    salaryMin: 0,
    salaryMax: 0,
    salaryCurrency: "INR",
    experienceLevel: "FRESHER",
    experienceYears: 0,
    skills: [],
    requirements: "", // Managed as raw newline text locally
    benefits: "", // Managed as raw newline text locally
    applicationDeadline: "",
    status: "ACTIVE",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    if (!jobId) return;

    let isActive = true;

    const loadJobDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFetch<SingleJobResponse>(`/jobs/${jobId}`);;

        if (!response?.job) {
          throw new Error("Job not found");
        }

        const job = response.job;

        if (!job) {
          throw new Error("Job not found");
        }

        let formattedDeadline = "";

        if (job.applicationDeadline) {
          formattedDeadline = new Date(job.applicationDeadline)
            .toISOString()
            .split("T")[0];
        }

        if (!isActive) return;

        setform({
          title: job.title || "",
          description: job.description || "",
          category: job.category || "",
          location: job.location || "",
          jobType: job.jobType || "FULL_TIME",
          workMode: job.workMode || "ONSITE",
          vacancies: job.vacancies ?? 1,
          salaryMin: job.salaryMin ?? 0,
          salaryMax: job.salaryMax ?? 0,
          salaryCurrency: job.salaryCurrency || "INR",
          experienceLevel: job.experienceLevel || "FRESHER",
          experienceYears: job.experienceYears ?? 0,
          skills: Array.isArray(job.skills) ? job.skills : [],
          requirements: Array.isArray(job.requirements)
            ? job.requirements.join("\n")
            : job.requirements || "",
          benefits: Array.isArray(job.benefits)
            ? job.benefits.join("\n")
            : job.benefits || "",
          applicationDeadline: formattedDeadline,
          status: job.status || "ACTIVE",
        });
      } catch (err: unknown) {
        console.error("Error fetching job details:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Failed to retrieve the requested job posting information.",
        );
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadJobDetails();

    return () => {
      isActive = false;
    };
  }, [jobId]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setform((prev) => ({
      ...prev,
      [name]: [
        "vacancies",
        "salaryMin",
        "salaryMax",
        "experienceYears",
      ].includes(name)
        ? Number(value)
        : value,
    }));
  };

  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setform((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setform((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      setError(null);

      // Convert back multi-line texts into standard string arrays for backend consumption
      const processedPayload: Jobform = {
        ...form,
        vacancies: Number(form.vacancies),
        experienceYears: Number(form.experienceYears),
        salaryMin: form.salaryMin ? Number(form.salaryMin) : 0,
        salaryMax: form.salaryMax ? Number(form.salaryMax) : 0,
        skills: form.skills,
        requirements: form.requirements
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0), // Generates clean string[]
        benefits: form.benefits
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0), // Generates clean string[]
        applicationDeadline: form.applicationDeadline
          ? new Date(form.applicationDeadline).toISOString()
          : "",
      };

      await apiFetch(`/jobs/${jobId}`, {
        method: "PATCH",
        body: JSON.stringify(processedPayload),
      });

      router.push("/company/jobs");
    } catch (err: unknown) {
      console.error("Error updating job listing:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your alterations right now.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin h-8 w-8 text-[#08a4a3]" />
        <span className="text-[#272d68]/60 text-sm font-semibold">
          Loading operational interface...
        </span>
      </div>
    );
  }

  if (error && !form.title) {
    return (
      <div className="text-center py-20 max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto text-rose-500 border border-rose-200">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <p className="font-extrabold text-[#272d68] text-lg">
          Sync Interface Terminated
        </p>
        <p className="text-[#272d68]/60 text-sm">{error}</p>
        <button
          onClick={() => router.push("/company/jobs")}
          className="inline-flex items-center gap-2 text-[#08a4a3] text-sm font-bold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Return to job index
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 pb-12">
      {/* Back Navigation Button */}
      <button
        type="button"
        onClick={() => router.push("/company/jobs")}
        className="flex items-center gap-2 text-sm font-bold text-[#272d68]/60 hover:text-[#272d68] transition"
      >
        <ArrowLeft className="w-4 h-4" /> Discard changes
      </button>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#272d68] tracking-tight">
            Modify Job Placement
          </h1>
          <p className="text-sm font-medium text-[#272d68]/60 mt-0.5">
            Updating ID ref:{" "}
            <span className="font-mono text-xs text-[#08a4a3]">{jobId}</span>
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 text-sm font-semibold">
          <AlertTriangle className="h-5 w-5 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION 1: CORE POSITION DETAILS */}
        <div className="rounded-2xl border border-[#272d68]/10 bg-white p-6 md:p-8 shadow-xs space-y-4">
          <h3 className="text-xs font-black text-[#272d68]/40 uppercase tracking-wider mb-2">
            Primary Parameters
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#272d68]/80">
                Job Position Title
              </label>
              <input
                type="text"
                name="title"
                required
                value={form.title}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#272d68] focus:border-[#08a4a3] focus:outline-hidden transition"
                placeholder="e.g. Lead Software Development Engineer"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#272d68]/80">
                Category
              </label>

              <select
                name="category"
                value={form.category || "SOFTWARE_DEVELOPMENT"}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#272d68] focus:border-[#08a4a3] focus:outline-hidden transition bg-white"
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="space-y-1">
              <label className="text-xs font-bold text-[#272d68]/80 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-400" />
                Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#272d68] focus:border-[#08a4a3] focus:outline-hidden transition"
                placeholder="e.g. Bangalore, IN or Remote"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#272d68]/80 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-gray-400" /> Job Type
              </label>
              <select
                name="jobType"
                value={form.jobType}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#272d68] focus:border-[#08a4a3] focus:outline-hidden transition bg-white"
              >
                <option value="FULL_TIME">Full Time</option>
                <option value="PART_TIME">Part Time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="CONTRACT">Contract</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-[#272d68]/80 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gray-400" /> Work Mode
              </label>
              <select
                name="workMode"
                value={form.workMode}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#272d68] focus:border-[#08a4a3] focus:outline-hidden transition bg-white"
              >
                <option value="ONSITE">On Site</option>
                <option value="REMOTE">Remote</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
          </div>
        </div>

        {/* SECTION 2: TRACKING METRICS & METADATA */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-[#272d68]/10 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-black text-[#272d68]/40 uppercase tracking-wider">
              Experience Metrics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#272d68]/80 flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-gray-400" /> Level of
                  Experience
                </label>
                <select
                  name="experienceLevel"
                  value={form.experienceLevel}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#272d68] focus:border-[#08a4a3] focus:outline-hidden transition bg-white"
                >
                  <option value="FRESHER">Fresher</option>
                  <option value="JUNIOR">Junior</option>
                  <option value="MID_LEVEL">Mid Level</option>
                  <option value="SENIOR">Senior</option>
                  <option value="LEAD">Lead</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#272d68]/80">
                  Required Experience (Yrs)
                </label>
                <input
                  type="number"
                  name="experienceYears"
                  min="0"
                  value={form.experienceYears}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#272d68] focus:border-[#08a4a3] focus:outline-hidden transition"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#272d68]/80">
                  Available vacancies
                </label>
                <input
                  type="number"
                  name="vacancies"
                  min="1"
                  required
                  value={form.vacancies}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#272d68] focus:border-[#08a4a3] focus:outline-hidden transition"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-[#272d68]/80 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" /> Close
                  Window Date
                </label>
                <input
                  type="date"
                  name="applicationDeadline"
                  value={form.applicationDeadline}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#272d68] focus:border-[#08a4a3] focus:outline-hidden transition"
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#272d68]/10 bg-white p-6 shadow-xs space-y-4">
            <h3 className="text-xs font-black text-[#272d68]/40 uppercase tracking-wider">
              Compensations Band
            </h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-bold text-[#272d68]/80 flex items-center gap-0.5">
                  {" "}
                  Minimum Range
                </label>
                <input
                  type="number"
                  name="salaryMin"
                  value={form.salaryMin}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#272d68] focus:border-[#08a4a3] focus:outline-hidden transition"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 pt-1">
              <div className="space-y-1 col-span-1">
                <label className="text-xs font-bold text-[#272d68]/80">
                  Status Pool
                </label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm text-[#272d68] font-bold focus:border-[#08a4a3] focus:outline-hidden transition bg-white"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="PAUSED">Paused</option>
                  <option value="CLOSED">Closed</option>
                  <option value="EXPIRED">Expired</option>
                </select>
              </div>
              <div className="space-y-1 col-span-2">
                <label className="text-xs font-bold text-[#272d68]/80 flex items-center gap-0.5">
                  Maximum Ceiling
                </label>
                <input
                  type="number"
                  name="salaryMax"
                  value={form.salaryMax}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-[#272d68] focus:border-[#08a4a3] focus:outline-hidden transition"
                />
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: CORE TARGET SKILL SET TAGS */}
        <div className="rounded-2xl border border-[#272d68]/10 bg-white p-6 md:p-8 shadow-xs space-y-4">
          <h3 className="text-xs font-black text-[#272d68]/40 uppercase tracking-wider">
            Target Skill Matrix
          </h3>
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && (e.preventDefault(), handleAddSkill())
              }
              className="w-full rounded-xl border border-gray-200 px-4 py-2 text-sm text-[#272d68] focus:border-[#08a4a3] focus:outline-hidden transition"
              placeholder="e.g. TypeScript, React, Next.js"
            />
            <button
              type="button"
              onClick={handleAddSkill}
              className="px-4 py-2 bg-slate-100 hover:bg-[#ceeeed] text-[#272d68] hover:text-[#08a4a3] font-bold rounded-xl text-xs transition flex items-center gap-1 shrink-0 border border-slate-200"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {form.skills.length === 0 ? (
              <span className="text-xs text-gray-400 italic">
                No targeted key skills added yet.
              </span>
            ) : (
              form.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-slate-50 border border-slate-200 pl-2.5 pr-1.5 py-1 rounded-lg text-xs text-[#272d68]/80 font-bold flex items-center gap-1"
                >
                  <Tag className="text-[#08a4a3] w-3 h-3" /> {skill}
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-gray-400 hover:text-rose-500 p-0.5 rounded-sm transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))
            )}
          </div>
        </div>

        {/* SECTION 4: MARKDOWN DESCRIPTIONS & MULTI-LINE LISTING ARRAYS */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-[#272d68]/10 bg-white p-6 md:p-8 shadow-xs space-y-2">
            <h3 className="text-xs font-black text-[#272d68]/40 uppercase tracking-wider">
              Role Overview
            </h3>
            <textarea
              name="description"
              required
              rows={5}
              value={form.description}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#272d68]/80 leading-relaxed focus:border-[#08a4a3] focus:outline-hidden transition font-medium"
              placeholder="Describe daily workflows, expectations, and high-level structural team operations..."
            />
          </div>

          <div className="rounded-2xl border border-[#272d68]/10 bg-white p-6 md:p-8 shadow-xs space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-[#272d68]/40 uppercase tracking-wider">
                Core Requirements
              </h3>
              <span className="text-[10px] font-semibold text-slate-400">
                Press Enter for new points
              </span>
            </div>
            <textarea
              name="requirements"
              rows={4}
              value={form.requirements}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#272d68]/80 leading-relaxed focus:border-[#08a4a3] focus:outline-hidden transition font-mono text-[13px]"
              placeholder="Minimum degree track criteria&#10;Technical stack operational backgrounds&#10;Process system understanding framework..."
            />
          </div>

          <div className="rounded-2xl border border-[#272d68]/10 bg-white p-6 md:p-8 shadow-xs space-y-2">
            <div className="flex justify-between items-center">
              <h3 className="text-xs font-black text-[#272d68]/40 uppercase tracking-wider">
                Compensations & Perks
              </h3>
              <span className="text-[10px] font-semibold text-slate-400">
                Press Enter for new points
              </span>
            </div>
            <textarea
              name="benefits"
              rows={4}
              value={form.benefits}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-[#272d68]/80 leading-relaxed focus:border-[#08a4a3] focus:outline-hidden transition font-mono text-[13px]"
              placeholder="Health, vision insurance programs&#10;Remote hardware allocation allowances&#10;Annual skill learning development budgets..."
            />
          </div>
        </div>

        {/* CONTROL ACTION INTERFACES FOOTER STRIP */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            disabled={saving}
            onClick={() => router.push("/company/jobs")}
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-[#272d68]/70 border border-gray-200 bg-white hover:bg-slate-50 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#272d68] hover:bg-[#08a4a3] disabled:bg-slate-300 text-white rounded-xl text-xs font-black tracking-wide shadow-md shadow-[#272d68]/10 transition flex items-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="animate-spin h-3.5 w-3.5" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5" />
                <span>Commit Job Modifications</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
