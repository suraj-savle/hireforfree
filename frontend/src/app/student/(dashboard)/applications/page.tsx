"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import {
  Briefcase,
  Building2,
  Calendar,
  Inbox,
  ArrowRight,
  CheckCircle,
  XCircle,
  Clock,
  MessageSquare,
  Eye,
  MapPin,
  GraduationCap,
  LucideIcon,
} from "lucide-react";
import Image from "next/image";

// Define types inline to avoid import issues
interface CompanyProfile {
  companyName?: string;
  logoUrl?: string;
  industry?: string;
}

interface CreatedBy {
  id: string;
  companyProfile: CompanyProfile;
  email: string;
  role: string;
}

interface Job {
  id: string;
  title: string;
  location?: string;
  jobType?: string;
  workMode?: string;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: string;
  description?: string;
  experienceLevel?: string;
  experienceYears?: number;
  category?: string;
  skills?: string[];
  createdBy: CreatedBy;
  createdAt: string;
  applicationDeadline?: string;
}

interface Application {
  id: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  jobId: string;
  studentId: string;
  job: Job;
}

interface ApplicationsResponse {
  applications: Application[];
}

const STATUS_CONFIG: Record<
  string,
  {
    label: string;
    icon: LucideIcon;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  APPLIED: {
    label: "Applied",
    icon: Clock,
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    icon: MessageSquare,
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    borderColor: "border-amber-200",
  },
  INTERVIEW: {
    label: "Interview",
    icon: MessageSquare,
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    borderColor: "border-indigo-200",
  },
  SELECTED: {
    label: "Selected",
    icon: CheckCircle,
    color: "text-emerald-700",
    bgColor: "bg-emerald-50",
    borderColor: "border-emerald-200",
  },
  REJECTED: {
    label: "Rejected",
    icon: XCircle,
    color: "text-rose-700",
    bgColor: "bg-rose-50",
    borderColor: "border-rose-200",
  },
};

const getImageUrl = (url?: string | null) => {
  if (!url || typeof url !== "string") return null;

  const cleaned = url.trim();
  if (!cleaned) return null;

  if (cleaned.startsWith("http")) return cleaned;

  return `${process.env.NEXT_PUBLIC_API_URL}${cleaned}`;
};

const formatSalary = (min?: number, max?: number, currency?: string) => {
  if (!min && !max) return "Not specified";
  const curr = currency || "INR";
  if (min && max)
    return `${curr} ${min.toLocaleString()} - ${max.toLocaleString()}`;
  if (min) return `${curr} ${min.toLocaleString()}+`;
  if (max) return `${curr} Up to ${max.toLocaleString()}`;
  return "Not specified";
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadApplications = async () => {
      try {
        if (isActive) {
          setLoading(true);
        }

        const data = await apiFetch<ApplicationsResponse>("/applications/my");


        if (!isActive) return;

        // Safely set applications with fallback
        setApplications(data?.applications || []);
      } catch (err: unknown) {
        console.error("Error loading application states:", err);

        if (isActive) {
          setApplications([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    loadApplications();

    return () => {
      isActive = false;
    };
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return formatDate(dateString);
  };

  const getStatusConfig = (status: string) => {
    const upperStatus = status?.toUpperCase() || "APPLIED";
    return STATUS_CONFIG[upperStatus] || STATUS_CONFIG.APPLIED;
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#ceeeed] rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#08a4a3] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <span className="text-[#272d68]/60 text-sm font-semibold">
          Loading your applications...
        </span>
      </div>
    );
  }

  // Group applications by status
  const groupedApplications = (applications ?? []).reduce(
    (acc, app) => {
      const status = app.status?.toUpperCase() || "APPLIED";
      if (!acc[status]) acc[status] = [];
      acc[status].push(app);
      return acc;
    },
    {} as Record<string, Application[]>,
  );

  const statusOrder = [
    "SELECTED",
    "INTERVIEW",
    "SHORTLISTED",
    "APPLIED",
    "REJECTED",
  ];

  return (
    <div className="max-w-5xl mx-auto w-full space-y-8 pb-12">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#272d68] to-[#08a4a3] p-8 text-white">
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black tracking-tight">
            My Applications
          </h1>
          <p className="text-white/80 text-sm md:text-base mt-2 max-w-lg">
            Track the status and progress of positions you&apos;ve applied for
          </p>
          <div className="mt-4 flex items-center gap-2">
            <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-semibold">
              Total: {applications.length} applications
            </div>
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {applications.length === 0 ? (
        /* Empty State */
        <div className="rounded-2xl border border-[#272d68]/10 bg-white p-12 text-center max-w-xl mx-auto space-y-6 shadow-sm">
          <div className="w-20 h-20 bg-gradient-to-br from-[#ceeeed]/30 to-[#08a4a3]/10 rounded-2xl flex items-center justify-center mx-auto">
            <Inbox className="w-10 h-10 text-[#08a4a3]" />
          </div>
          <div>
            <h3 className="font-extrabold text-[#272d68] text-2xl">
              No Applications Yet
            </h3>
            <p className="text-[#272d68]/60 text-sm mt-2 max-w-sm mx-auto">
              You haven&apos;t submitted your profile for any open vacancies
              yet. Explore our openings board to get started on your career
              journey.
            </p>
          </div>
          <div className="pt-4">
            <Link
              href="/student/jobs"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-[#272d68] to-[#08a4a3] hover:shadow-lg text-white font-bold text-sm px-6 py-3 rounded-xl transition-all"
            >
              Browse Open Positions
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        /* Applications by Status */
        <div className="space-y-8">
          {statusOrder.map((statusKey) => {
            const statusApps = groupedApplications[statusKey];
            if (!statusApps || statusApps.length === 0) return null;

            const config = getStatusConfig(statusKey);
            const StatusIcon = config.icon;

            return (
              <div key={statusKey} className="space-y-3">
                {/* Status Header */}
                <div className="flex items-center gap-2 px-2">
                  <div className={`p-1.5 rounded-lg ${config.bgColor}`}>
                    <StatusIcon className={`w-4 h-4 ${config.color}`} />
                  </div>
                  <h2 className="font-bold text-[#272d68] text-lg">
                    {config.label}
                  </h2>
                  <span className="text-xs text-[#272d68]/40 font-semibold">
                    ({statusApps.length})
                  </span>
                </div>

                {/* Applications Cards */}
                <div className="space-y-3">
                  {statusApps.map((application) => {
                    const job = application.job;
                    const companyProfile = job?.createdBy?.companyProfile;
                    const companyName =
                      companyProfile?.companyName || "Company";
                    const logoUrl = getImageUrl(
                      job.createdBy?.companyProfile?.logoUrl,
                    );
                    const statusConfig = getStatusConfig(application.status);
                    const StatusIconComponent = statusConfig.icon;

                    return (
                      <div
                        key={application.id}
                        className="group relative rounded-2xl border border-[#272d68]/10 bg-white hover:shadow-lg transition-all duration-300 overflow-hidden"
                      >
                        {/* Status indicator bar */}
                        <div
                          className={`absolute left-0 top-0 bottom-0 w-1 ${statusConfig.bgColor}`}
                        ></div>

                        <div className="p-5 md:p-6 pl-6">
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                            {/* Left Section - Company & Job Info */}
                            <div className="flex items-start gap-4 flex-1">
                              {/* Company Logo */}
                              <div className="relative w-14 h-14 rounded-xl bg-linea-to-br from-gray-50 to-gray-100 border border-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                                {logoUrl ? (
                                  <Image
                                    src={logoUrl}
                                    alt={companyName}
                                    loading="lazy"
                                    className="w-full h-full object-cover"
                                    width={100}
                                    height={100}
                                    unoptimized
                                  />
                                ) : (
                                  <Building2 className="w-6 h-6 text-[#272d68]/30" />
                                )}
                              </div>

                              <div className="space-y-2 flex-1 min-w-0">
                                {/* Job Title */}
                                <Link
                                  href={`/student/jobs/${job?.id}`}
                                  className="font-black text-lg text-[#272d68] group-hover:text-[#08a4a3] transition-colors duration-200 line-clamp-1 inline-block"
                                >
                                  {job?.title || "Untitled Position"}
                                </Link>

                                {/* Company Name */}
                                <div className="flex items-center gap-2 text-sm text-[#272d68]/70">
                                  <Building2 className="w-3.5 h-3.5" />
                                  <span className="font-medium">
                                    {companyName}
                                  </span>
                                </div>

                                {/* Job Details Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                  {job?.location && (
                                    <div className="flex items-center gap-1.5 text-xs text-[#272d68]/60">
                                      <MapPin className="w-3 h-3" />
                                      <span>{job.location}</span>
                                    </div>
                                  )}
                                  {job?.jobType && (
                                    <div className="flex items-center gap-1.5 text-xs text-[#272d68]/60">
                                      <Briefcase className="w-3 h-3" />
                                      <span>
                                        {job.jobType.replace("_", " ")}
                                      </span>
                                    </div>
                                  )}
                                  {job?.workMode && (
                                    <div className="flex items-center gap-1.5 text-xs text-[#272d68]/60">
                                      <Clock className="w-3 h-3" />
                                      <span>{job.workMode}</span>
                                    </div>
                                  )}
                                  {(job?.salaryMin || job?.salaryMax) && (
                                    <div className="flex items-center gap-1.5 text-xs text-[#272d68]/60">
                                      <span>
                                        {formatSalary(
                                          job.salaryMin,
                                          job.salaryMax,
                                          job.salaryCurrency,
                                        )}
                                      </span>
                                    </div>
                                  )}
                                  {job?.experienceLevel && (
                                    <div className="flex items-center gap-1.5 text-xs text-[#272d68]/60">
                                      <GraduationCap className="w-3 h-3" />
                                      <span>{job.experienceLevel}</span>
                                    </div>
                                  )}
                                </div>

                                {/* Skills Preview */}
                                {job?.skills && job.skills.length > 0 && (
                                  <div className="flex flex-wrap gap-1.5 mt-2">
                                    {job.skills
                                      .slice(0, 3)
                                      .map((skill, idx) => (
                                        <span
                                          key={idx}
                                          className="px-2 py-0.5 text-xs bg-[#ceeeed]/30 rounded-lg text-[#272d68]/70"
                                        >
                                          {skill}
                                        </span>
                                      ))}
                                    {job.skills.length > 3 && (
                                      <span className="px-2 py-0.5 text-xs text-[#272d68]/40">
                                        +{job.skills.length - 3}
                                      </span>
                                    )}
                                  </div>
                                )}

                                {/* Application Date */}
                                <div className="flex items-center gap-1.5 text-xs text-[#272d68]/40 mt-2">
                                  <Calendar className="w-3 h-3" />
                                  <span>
                                    Applied{" "}
                                    {getRelativeTime(application.createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Right Section - Status & Actions */}
                            <div className="flex items-center gap-3">
                              {/* Status Badge */}
                              <div
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold capitalize ${statusConfig.bgColor} ${statusConfig.color} border ${statusConfig.borderColor}`}
                              >
                                <StatusIconComponent className="w-3.5 h-3.5" />
                                {statusConfig.label}
                              </div>

                              {/* Action Button */}
                              {job?.id && (
                                <Link
                                  href={`/student/jobs/${job.id}`}
                                  className="p-2 rounded-lg bg-gray-50 hover:bg-[#ceeeed]/30 text-[#272d68]/50 hover:text-[#08a4a3] transition-all"
                                  title="View Job Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </Link>
                              )}
                            </div>
                          </div>

                          {/* Updated timestamp for recent updates */}
                          {application.updatedAt &&
                            application.updatedAt !== application.createdAt && (
                              <div className="mt-3 pt-3 border-t border-[#272d68]/5">
                                <p className="text-xs text-[#272d68]/40 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  Status updated:{" "}
                                  {formatDate(application.updatedAt)}
                                </p>
                              </div>
                            )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
