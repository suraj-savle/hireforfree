"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import {
  MapPin,
  Briefcase,
  Clock,
  CheckCircle2,
  Loader2,
  AlertTriangle,
  Tag,
  ArrowLeft,
  Users,
  Calendar,
  Layers,
  Award,
  Building2,
} from "lucide-react";

// Define types inline to avoid import issues
interface CompanyProfile {
  companyName?: string;
  logoUrl?: string;
}

interface CreatedBy {
  companyProfile?: CompanyProfile;
}

interface JobData {
  id: string;
  title: string;
  description: string;
  category: string;
  location?: string;
  jobType: string;
  workMode: string;
  vacancies?: number;
  applicationCount?: number;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  experienceLevel?: string;
  experienceYears?: number;
  skills?: string[];
  requirements?: string | string[];
  benefits?: string | string[];
  applicationDeadline?: string;
  status: string;
  createdBy?: CreatedBy;
  createdById?: string;
}

interface Application {
  id: string;
  jobId?: string;
  job?: { _id?: string };
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface ApplicationsResponse {
  applications: Application[];
}

// API response wrapper
interface ApiResponse<T> {
  job?: T;
  applications?: Application[];
  [key: string]: unknown;
}

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;

  const [job, setJob] = useState<JobData | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    if (!jobId) return;

    let isActive = true;

    const loadJobAndStatus = async () => {
      try {
        if (isActive) {
          setLoading(true);
        }

        const [response, userApps] = await Promise.all([
          apiFetch<ApiResponse<JobData>>(`/jobs/${jobId}`),
          apiFetch<ApplicationsResponse>("/applications/my").catch(() => ({
            applications: [],
          })),
        ]);

        if (!isActive) return;

        // Extract job data properly
        const jobData = response?.job || response;
        setJob(jobData as JobData);

        const targetJobId = jobData?.id || jobData?.id || jobId;

        // Extract applications list safely
        const appList = Array.isArray(userApps)
          ? userApps
          : userApps?.applications || [];

        const userHasApplied = appList.some(
          (app: Application) =>
            app.jobId === targetJobId || app.job?._id === targetJobId,
        );

        setApplied(userHasApplied);
      } catch (err: unknown) {
        console.error("Error evaluating target item state mapping:", err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadJobAndStatus();

    return () => {
      isActive = false;
    };
  }, [jobId]);

  const applyJob = async () => {
    if (!job?.id && !jobId) {
      alert("Job ID is missing. Please try again.");
      return;
    }

    try {
      setApplying(true);
      await apiFetch("/applications", {
        method: "POST",
        body: JSON.stringify({ jobId: job?.id || jobId }),
      });
      setApplied(true);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to submit your application. Please check your network connection.";

      alert(message);
    } finally {
      setApplying(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <Loader2 className="animate-spin h-8 w-8 text-[#08a4a3]" />
        <span className="text-[#272d68]/60 text-sm font-semibold">
          Loading placement details...
        </span>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="text-center py-20 max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-500 border border-amber-200">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <p className="font-extrabold text-[#272d68] text-lg">
          Position Unreachable
        </p>
        <p className="text-[#272d68]/60 text-sm">
          The requested job opening has either expired, been completed, or
          withdrawn.
        </p>
        <button
          onClick={() => router.push("/student/jobs")}
          className="inline-flex items-center gap-2 text-[#08a4a3] text-sm font-bold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" /> Return to job directory
        </button>
      </div>
    );
  }

  const companyName =
    job.createdBy?.companyProfile?.companyName || "Direct Client Account";

  const getImageUrl = (url?: string | null) => {
    if (!url || typeof url !== "string") return null;

    const cleaned = url.trim();
    if (!cleaned) return null;

    if (cleaned.startsWith("http")) return cleaned;

    return `${process.env.NEXT_PUBLIC_API_URL}${cleaned}`;
  };

  const logoUrl = getImageUrl(job.createdBy?.companyProfile?.logoUrl);


  return (
    <div className="max-w-4xl mx-auto w-full space-y-6 pb-12">
      {/* Back Navigation Button */}
      <button
        onClick={() => router.push("/student/jobs")}
        className="flex items-center gap-2 text-sm font-bold text-[#272d68]/60 hover:text-[#272d68] transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to listings
      </button>

      {/* 1. MAIN CARD HEADER: COMPANY LOGO, NAME, AND SUBMIT BUTTON */}
      <div className="rounded-2xl border border-[#272d68]/10 bg-white p-6 md:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
          {/* Logo & Identity info block */}
          <div className="flex items-center gap-4">
            <div className="relative w-14 h-14 rounded-xl bg-linear-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt={companyName}
                  width={100}
                  height={100}
                  unoptimized
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="w-6 h-6 text-[#272d68]/30" />
              )}
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-black text-[#272d68] tracking-tight leading-tight">
                {job.title}
              </h1>
            </div>
          </div>
        </div>

        {/* Location & Metadata Pill Identifiers */}
        <div className="flex flex-col gap-x-4 gap-y-2 text-[#272d68]/70 text-xs font-semibold border-t border-gray-100 pt-4">
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-1.5">
              <MapPin className="text-[#272d68]/40 w-4 h-4" />{" "}
              {job.location || "Remote"}
            </span>
            <span className="flex items-center gap-1.5">
              <Briefcase className="text-[#272d68]/40 w-4 h-4" /> {job.jobType}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="text-[#272d68]/40 w-4 h-4" /> {job.workMode}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Building2 className="w-4 h-4 text-[#272d68] text-xs" />
            <p className="text-[#272d68] text-xs font-bold">
              Company: {companyName}
            </p>
          </div>
        </div>

        {/* Primary Call-to-Action Application Button */}
        <div className="pt-2">
          <button
            disabled={applying || applied || job.status !== "ACTIVE"}
            onClick={applyJob}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm tracking-wide transition flex items-center justify-center gap-2 ${
              applied
                ? "bg-emerald-50 border border-emerald-200 text-emerald-600 cursor-not-allowed"
                : job.status !== "ACTIVE"
                  ? "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                  : "bg-[#272d68] hover:bg-[#08a4a3] text-white shadow-md shadow-[#272d68]/10"
            }`}
          >
            {applying ? (
              <>
                <Loader2 className="animate-spin h-4 w-4" />
                <span>Submitting...</span>
              </>
            ) : applied ? (
              <>
                <CheckCircle2 className="text-emerald-500 h-4 w-4" />
                <span>Applied Successfully</span>
              </>
            ) : job.status !== "ACTIVE" ? (
              <span>Archived Position</span>
            ) : (
              <span>Submit Profile Application</span>
            )}
          </button>
        </div>
      </div>

      {/* 2. OVERVIEW STRIP: KEY METRICS HIGHLIGHTS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-white border border-[#272d68]/10 rounded-2xl p-4 shadow-xs text-xs font-bold text-[#272d68]/70">
        <div className="p-2 bg-slate-50/60 rounded-xl border border-gray-50 flex flex-col justify-between gap-1">
          <span className="text-[#272d68]/50 font-semibold">Vacancies:</span>
          <span className="text-[#272d68] text-sm">
            {job.vacancies || 1} Openings
          </span>
        </div>
        <div className="p-2 bg-slate-50/60 rounded-xl border border-gray-50 flex flex-col justify-between gap-1">
          <span className="text-[#272d68]/50 font-semibold">Applicants:</span>
          <span className="text-[#272d68] text-sm flex items-center gap-1">
            <Users className="w-3.5 h-3.5 text-[#272d68]/40" />{" "}
            {job.applicationCount || 0} applied
          </span>
        </div>
        <div className="p-2 bg-slate-50/60 rounded-xl border border-gray-50 flex flex-col justify-between gap-1">
          <span className="text-[#272d68]/50 font-semibold">Deadline:</span>
          <span className="text-[#272d68] text-sm flex items-center gap-1 font-mono text-[11px]">
            <Calendar className="w-3.5 h-3.5 text-[#272d68]/40" />{" "}
            {formatDate(job.applicationDeadline)}
          </span>
        </div>
        <div className="p-2 bg-slate-50/60 rounded-xl border border-gray-50 flex flex-col justify-between gap-1">
          <span className="text-[#272d68]/50 font-semibold">
            Compensation Range:
          </span>
          <span className="text-emerald-600 font-black text-sm flex items-center gap-0.5">
            {job.salaryMin?.toLocaleString() || "N/A"} -{" "}
            {job.salaryMax?.toLocaleString() || "N/A"}{" "}
            <span className="text-[10px] ml-0.5 font-normal text-slate-500">
              {job.salaryCurrency || "INR"}
            </span>
          </span>
        </div>
      </div>

      {/* 3. LOWER SECTION: JOB DETAIL SPECIFICATIONS STACKED STEP-BY-STEP */}
      <div className="space-y-6">
        {/* Detailed Classifications Mapping Card */}
        <div className="rounded-2xl border border-[#272d68]/10 bg-white p-6 md:p-8 shadow-xs space-y-4">
          <h3 className="text-xs font-black text-[#272d68]/40 uppercase tracking-wider">
            Classification & Level
          </h3>
          <div className="flex flex-wrap gap-4 text-sm font-semibold text-[#272d68]/80">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#08a4a3]" />
              <span>
                Category:{" "}
                <strong className="text-[#272d68]">
                  {job.category?.replace(/_/g, " ") || "General"}
                </strong>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-[#08a4a3]" />
              <span>
                Experience:{" "}
                <strong className="text-[#272d68]">
                  {job.experienceLevel || "Fresher"} ({job.experienceYears ?? 0}{" "}
                  Years)
                </strong>
              </span>
            </div>
          </div>

          {/* Skill Tag Block Iterations */}
          {job.skills && job.skills.length > 0 && (
            <div className="pt-2 space-y-2">
              <span className="text-[11px] font-black text-[#272d68]/40 uppercase tracking-wider block">
                Target Skills
              </span>
              <div className="flex flex-wrap gap-1.5">
                {job.skills.map((skill: string, idx: number) => (
                  <span
                    key={idx}
                    className="bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-xs text-[#272d68]/80 font-bold flex items-center gap-1"
                  >
                    <Tag className="text-[10px] text-[#08a4a3] w-3 h-3" />{" "}
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Role Overview Paragraph */}
        <div className="rounded-2xl border border-[#272d68]/10 bg-white p-6 md:p-8 shadow-xs">
          <h3 className="text-xs font-black text-[#272d68]/40 uppercase tracking-wider mb-3">
            Role Overview
          </h3>
          <p className="text-[#272d68]/80 text-sm leading-relaxed whitespace-pre-wrap font-medium">
            {job.description || "No description provided."}
          </p>
        </div>

        {/* Core Requirements Conditional Setup */}
        {job.requirements &&
          (Array.isArray(job.requirements)
            ? job.requirements.length > 0
            : String(job.requirements).trim()) && (
            <div className="rounded-2xl border border-[#272d68]/10 bg-white p-6 md:p-8 shadow-xs">
              <h3 className="text-xs font-black text-[#272d68]/40 uppercase tracking-wider mb-4">
                Core Requirements
              </h3>
              {Array.isArray(job.requirements) ? (
                <ul className="space-y-2.5 text-[#272d68]/80 text-sm font-medium list-inside list-disc marker:text-[#08a4a3]">
                  {job.requirements.map((req: string, idx: number) => (
                    <li key={idx} className="pl-1">
                      {req}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#272d68]/80 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {job.requirements}
                </p>
              )}
            </div>
          )}

        {/* Compensations & Benefits Array List Mapping */}
        {job.benefits &&
          (Array.isArray(job.benefits)
            ? job.benefits.length > 0
            : String(job.benefits).trim()) && (
            <div className="rounded-2xl border border-[#272d68]/10 bg-white p-6 md:p-8 shadow-xs">
              <h3 className="text-xs font-black text-[#272d68]/40 uppercase tracking-wider mb-4">
                Compensations & Benefits
              </h3>
              {Array.isArray(job.benefits) ? (
                <div className="flex flex-wrap gap-2">
                  {job.benefits.map((benefit: string, idx: number) => (
                    <span
                      key={idx}
                      className="bg-emerald-50 border border-emerald-100 text-emerald-700 font-bold rounded-xl px-3 py-1.5 text-xs"
                    >
                      {benefit}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-[#272d68]/80 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {job.benefits}
                </p>
              )}
            </div>
          )}
      </div>
    </div>
  );
}
