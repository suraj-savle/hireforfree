"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import {
  Briefcase,
  MapPin,
  Plus,
  X,
  AlertCircle,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { Company } from "@/types/company";

export default function CompanyCreateJobPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Form State
  const [form, setForm] = useState({
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

  // Array states for cleaner tag-based management
  const [skills, setSkills] = useState<string[]>([]);
  const [requirements, setRequirements] = useState<string[]>([]);
  const [benefits, setBenefits] = useState<string[]>([]);

  // Individual input buffers for the tag generators
  const [skillInput, setSkillInput] = useState("");
  const [reqInput, setReqInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");

  const [verificationStatus, setVerificationStatus] = useState<string | null>(
    null,
  );

  const [verificationLoading, setVerificationLoading] = useState(true);

  useEffect(() => {
    const checkVerification = async () => {
      try {
        const company = await apiFetch<Company>("/profiles/company/me");


        setVerificationStatus(company?.approvalStatus);
      } catch (error) {
        console.error(error);
        setVerificationStatus(null);
      } finally {
        setVerificationLoading(false);
      }
    };

    checkVerification();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Helper to add list chips cleanly
  const addTag = (type: "skills" | "requirements" | "benefits") => {
    if (type === "skills" && skillInput.trim()) {
      if (!skills.includes(skillInput.trim()))
        setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
    if (type === "requirements" && reqInput.trim()) {
      if (!requirements.includes(reqInput.trim()))
        setRequirements([...requirements, reqInput.trim()]);
      setReqInput("");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (Number(form.salaryMin) > Number(form.salaryMax)) {
      setErrorMessage(
        "Minimum salary value cannot be greater than Maximum salary.",
      );
      return;
    }

    if (skills.length === 0) {
      setErrorMessage("Please specify at least one core required skill tag.");
      return;
    }

    try {
      setLoading(true);

      await apiFetch("/jobs", {
        method: "POST",
        body: JSON.stringify({
          ...form,
          vacancies: Number(form.vacancies),
          ...(form.salaryMin && {
            salaryMin: Number(form.salaryMin),
          }),
          ...(form.salaryMax && {
            salaryMax: Number(form.salaryMax),
          }),
          experienceYears: Number(form.experienceYears),
          skills,
          requirements,
          benefits,
          ...(form.applicationDeadline && {
            applicationDeadline: new Date(
              form.applicationDeadline,
            ).toISOString(),
          }),
        }),
      });

      // Redirect altered to route inside company scope
      router.push("/company/jobs");
    } catch (error: unknown) {
      console.error(error);

      const message =
        typeof error === "object" && error !== null && "message" in error
          ? String(error.message)
          : "Failed to publish job opening. Please check your inputs.";

      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  };

  // Shared reusable styling for form input components
  const inputStyles =
    "w-full rounded-xl border border-[#272d68]/15 bg-slate-50/50 p-3 text-sm font-semibold text-[#272d68] placeholder-[#272d68]/30 focus:border-[#08a4a3] focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#08a4a3] transition-all duration-200";

  if (verificationLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="text-[#272d68] font-semibold">
          Checking company verification...
        </div>
      </div>
    );
  }

  if (verificationStatus === "REJECTED") {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
          <AlertCircle className="w-14 h-14 text-rose-600 mx-auto mb-4" />

          <h1 className="text-2xl font-bold text-[#272d68] mb-3">
            Verification Rejected
          </h1>

          <p className="text-[#272d68]/70 mb-6">
            Your company verification request was rejected. Please update your
            company profile and resubmit the required documents.
          </p>

          <Link
            href="/company/profile"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-rose-600 text-white font-semibold hover:bg-rose-700"
          >
            Update Company Profile
          </Link>
        </div>
      </div>
    );
  }

  if (verificationStatus === "PENDING") {
    return (
      <div className="max-w-2xl mx-auto py-12">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
          <AlertCircle className="w-14 h-14 text-amber-600 mx-auto mb-4" />

          <h1 className="text-2xl font-bold text-[#272d68] mb-3">
            Verification In Review
          </h1>

          <p className="text-[#272d68]/70 mb-6">
            Your company verification request is currently under review. Job
            posting will be enabled once your account is approved.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl pb-12">
      {/* Title Header */}
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-black text-[#272d68] tracking-tight">
          Post a New Job Opening
        </h1>
        <p className="text-[#272d68]/60 text-sm font-medium">
          Fill out the job specifications below to publish your opening to the
          active candidate feed.
        </p>
      </div>

      {/* Error Alert Box */}
      {errorMessage && (
        <div className="absolute max-w-100 right-10 top-20 mb-6 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-2xl border border-[#272d68]/10 bg-white p-6 md:p-8 shadow-sm"
      >
        {/* SECTION 1: ROLE ESSENTIALS */}
        <div className="space-y-4">
          <h3 className="text-base font-black text-[#272d68] border-b border-[#272d68]/5 pb-2 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-[#08a4a3]" /> Core Specifications
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1.5">
                Job Title
              </label>
              <input
                name="title"
                required
                placeholder="e.g., Senior Full Stack Engineer"
                value={form.title}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1.5">
                Job Category
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
            <label className="block text-xs font-bold text-[#272d68]/70 mb-1.5">
              Role Description
            </label>
            <textarea
              name="description"
              required
              placeholder="Provide a detailed breakdown of the role responsibilities, day-to-day work expectations, and team dynamics..."
              rows={6}
              value={form.description}
              onChange={handleChange}
              className={inputStyles}
            />
          </div>
        </div>

        {/* SECTION 2: LOGISTICS */}
        <div className="space-y-4">
          <h3 className="text-base font-black text-[#272d68] border-b border-[#272d68]/5 pb-2 flex items-center gap-2">
            <MapPin className="h-4 w-4 text-[#08a4a3]" /> Logistics &
            Demographics
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1.5">
                Location
              </label>
              <input
                name="location"
                placeholder="e.g., Mumbai or Remote"
                value={form.location}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1.5">
                Employment Type
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
                <option value="CONTRACT">Contract Basis</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1.5">
                Workspace Mode
              </label>
              <select
                name="workMode"
                value={form.workMode}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="REMOTE">Remote</option>
                <option value="ONSITE">On-Site</option>
                <option value="HYBRID">Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1.5">
                Total Target Vacancies
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
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1.5">
                Experience Level Tier
              </label>
              <select
                name="experienceLevel"
                value={form.experienceLevel}
                onChange={handleChange}
                className={inputStyles}
              >
                <option value="FRESHER">Fresher / Graduate Entry</option>
                <option value="JUNIOR">Junior (1-2 Years)</option>
                <option value="MID_LEVEL">Mid Level (3-5 Years)</option>
                <option value="SENIOR">Senior Executive (5+ Years)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1.5">
                Minimum Experience Required (Years)
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

        {/* SECTION 3: COMPENSATION AND TARGET DATES */}
        <div className="space-y-4">
          <h3 className="text-base font-black text-[#272d68] border-b border-[#272d68]/5 pb-2 flex items-center gap-2">
            Compensation & Deadlines
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1.5">
                Minimum Annual Salary
              </label>
              <input
                name="salaryMin"
                type="number"
                placeholder="e.g., 70000"
                value={form.salaryMin}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1.5">
                Maximum Annual Salary
              </label>
              <input
                name="salaryMax"
                type="number"
                placeholder="e.g., 110000"
                value={form.salaryMax}
                onChange={handleChange}
                className={inputStyles}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#272d68]/70 mb-1.5">
                Application Closing Deadline
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

        {/* SECTION 4: TAG METADATA LIST BUILDERS */}
        <div className="space-y-6">
          <h3 className="text-base font-black text-[#272d68] border-b border-[#272d68]/5 pb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#08a4a3]" /> Skills, Requirements
            & Perks
          </h3>

          {/* DYNAMIC CHIP BUILDER: SKILLS */}
          <div>
            <label className="block text-xs font-bold text-[#272d68]/70 mb-1.5">
              Required Skills (Add items one by one)
            </label>
            <div className="flex gap-2 mb-2">
              <input
                placeholder="e.g., TypeScript"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag("skills"))
                }
                className={inputStyles}
              />
              <button
                type="button"
                onClick={() => addTag("skills")}
                className="px-4 rounded-xl bg-slate-100 border border-slate-200 text-[#272d68] hover:bg-slate-200 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#ceeeed]/40 border border-[#08a4a3]/20 px-2.5 py-1 text-xs font-bold text-[#08a4a3]"
                >
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer text-[#08a4a3]/60 hover:text-[#08a4a3]"
                    onClick={() => removeTag("skills", idx)}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* DYNAMIC CHIP BUILDER: REQUIREMENTS */}
          <div>
            <label className="block text-xs font-bold text-[#272d68]/70 mb-1.5">
              Detailed Candidate Requirements
            </label>
            <div className="flex gap-2 mb-2">
              <input
                placeholder="e.g., Strong understanding of RESTful API contracts"
                value={reqInput}
                onChange={(e) => setReqInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" &&
                  (e.preventDefault(), addTag("requirements"))
                }
                className={inputStyles}
              />
              <button
                type="button"
                onClick={() => addTag("requirements")}
                className="px-4 rounded-xl bg-slate-100 border border-slate-200 text-[#272d68] hover:bg-slate-200 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {requirements.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#272d68]/5 border border-[#272d68]/10 px-2.5 py-1 text-xs font-bold text-[#272d68]/80"
                >
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer text-[#272d68]/40 hover:text-[#272d68]"
                    onClick={() => removeTag("requirements", idx)}
                  />
                </span>
              ))}
            </div>
          </div>

          {/* DYNAMIC CHIP BUILDER: BENEFITS */}
          <div>
            <label className="block text-xs font-bold text-[#272d68]/70 mb-1.5">
              Company Perks & Benefits
            </label>
            <div className="flex gap-2 mb-2">
              <input
                placeholder="e.g., Comprehensive Health coverage plan"
                value={benefitInput}
                onChange={(e) => setBenefitInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag("benefits"))
                }
                className={inputStyles}
              />
              <button
                type="button"
                onClick={() => addTag("benefits")}
                className="px-4 rounded-xl bg-slate-100 border border-slate-200 text-[#272d68] hover:bg-slate-200 transition"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {benefits.map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-amber-50 border border-amber-200 px-2.5 py-1 text-xs font-bold text-amber-700"
                >
                  {tag}
                  <X
                    className="h-3 w-3 cursor-pointer text-amber-600/60 hover:text-amber-700"
                    onClick={() => removeTag("benefits", idx)}
                  />
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* CONTROLS SUBMIT ROW */}
        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            disabled={loading}
            className="w-full md:w-auto px-8 py-3 rounded-xl bg-[#08a4a3] font-black text-sm text-white hover:bg-[#068f8e] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm shadow-[#08a4a3]/20"
          >
            {loading ? "Publishing Opening..." : "Publish Job Post"}
          </button>
        </div>
      </form>
    </div>
  );
}
