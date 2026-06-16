"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  Briefcase,
  Users,
  UserCheck,
  CheckCircle,
  Clock,
  MapPin,
  ChevronRight,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";
import Link from "next/link";

interface Job {
  id: string;
  title: string;
  location?: string;
  createdAt: string;
  _count?: {
    applications: number;
  };
}

interface Application {
  id: string;
  status: "PENDING" | "SHORTLISTED" | "ACCEPTED" | "REJECTED" | "APPLIED";
  job?: {
    title: string;
  };
  student?: {
    fullName?: string;
  };
}

interface CompanyProfile {
  approvalStatus?: string;
  rejectionReason?: string;
}

interface DashboardData {
  jobsCount: number;
  jobs: Job[];
  companyProfile?: CompanyProfile;
}

export default function CompanyHomePage() {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isActive = true;

    const loadDashboard = async () => {
      try {
        const dashboardRes =
          await apiFetch<DashboardData>("/dashboard/company");
        const applicationsRes = await apiFetch<{ applications: Application[] }>(
          "/applications/received",
        );

        if (!isActive) return;

        setDashboard(dashboardRes);
        setApplications(applicationsRes.applications || []);
      } catch (err: unknown) {
        console.error("Failed to load dashboard:", err);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadDashboard();

    return () => {
      isActive = false;
    };
  }, []);

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-50/50 p-6 space-y-6 max-w-7xl mx-auto animate-pulse">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-zinc-200 rounded-lg" />
          <div className="h-4 w-32 bg-zinc-200 rounded" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-28 bg-white border border-zinc-200 rounded-xl p-5"
            />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-white border border-zinc-200 rounded-xl" />
          <div className="h-80 bg-white border border-zinc-200 rounded-xl" />
        </div>
      </div>
    );
  }

  const totalApplications = applications.length;
  const shortlisted = applications.filter(
    (app) => app.status === "SHORTLISTED",
  ).length;
  const hired = applications.filter((app) => app.status === "ACCEPTED").length;
  const applied = applications.filter((app) => app.status === "APPLIED").length;
  const jobs = dashboard?.jobs ?? [];

  const profileStatus = dashboard?.companyProfile?.approvalStatus ?? "PENDING";

  return (
    <div className="min-h-screen bg-zinc-50/40 p-4 sm:p-6 lg:p-8 space-y-8 max-w-7xl mx-auto text-zinc-900 antialiased">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-zinc-200/60 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-zinc-950">
            Company Dashboard
          </h1>
          <p className="text-sm text-zinc-500 mt-1">
            Overview of your organization registry, open listings, and applicant
            metrics.
          </p>
        </div>
      </div>

      {/* Verification Banners */}
      {profileStatus === "APPROVED" && (
        <div className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 shadow-xs">
          <CheckCircle className="text-emerald-600 h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-emerald-900 text-sm">
              Company Verified
            </p>
            <p className="text-xs text-emerald-700 mt-0.5">
              Your company profile has been approved. Your active job listings
              are live on the platform.
            </p>
          </div>
        </div>
      )}

      {profileStatus === "PENDING" && (
        <div className="bg-amber-50/60 border border-amber-200 rounded-xl p-4 flex items-start gap-3 shadow-xs">
          <Clock className="text-amber-600 h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-amber-900 text-sm">
              Verification Pending
            </p>
            <p className="text-xs text-amber-700 mt-0.5">
              Your company profile is waiting for admin approval. Marketplace
              operations may be restricted.
            </p>
          </div>
        </div>
      )}

      {profileStatus === "REJECTED" && (
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 flex items-start gap-3 shadow-xs">
          <AlertTriangle className="text-rose-600 h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-rose-900 text-sm">
              Verification Rejected
            </p>
            <p className="text-xs text-rose-700 mt-1">
              Reason specified:{" "}
              <span className="font-medium">
                `
                {dashboard?.companyProfile?.rejectionReason ||
                  "No details provided."}
                `
              </span>
            </p>
          </div>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1 */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 font-semibold text-xs uppercase tracking-wider">
              Total Active Jobs
            </span>
            <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-500">
              <Briefcase size={16} />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mt-4">
            {dashboard?.jobsCount || 0}
          </h2>
        </div>

        {/* Card 2 */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 font-semibold text-xs uppercase tracking-wider">
              Total Applications{" "}
            </span>
            <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-500">
              <Users size={16} />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mt-4">
            {totalApplications}
          </h2>
        </div>

        {/* Card 3 */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 font-semibold text-xs uppercase tracking-wider">
              Shortlisted
            </span>
            <div className="p-2 bg-zinc-50 border border-zinc-100 rounded-lg text-zinc-500">
              <UserCheck size={16} />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-zinc-900 mt-4">
            {shortlisted}
          </h2>
        </div>

        {/* Card 4 */}
        <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center">
            <span className="text-zinc-400 font-semibold text-xs uppercase tracking-wider">
              Hired Pool
            </span>
            <div className="p-2 bg-emerald-50/50 border border-emerald-100 rounded-lg text-emerald-600">
              <CheckCircle size={16} />
            </div>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-emerald-600 mt-4">
            {hired}
          </h2>
        </div>
      </div>

      {/* Asymmetric Split Layout Blocks */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Recent Active Job Openings */}
        <div className="lg:col-span-2 bg-white border border-zinc-200/80 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="border-b border-zinc-100 p-5 flex items-center justify-between bg-zinc-50/50">
            <div>
              <h2 className="font-bold text-zinc-950 text-sm">
                Recent Job Postings
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                Your primary active job listings metrics.
              </p>
            </div>
            <Link
              href="/company/jobs"
              className="text-xs font-bold text-zinc-500 hover:text-zinc-950 inline-flex items-center gap-0.5 transition"
            >
              <span>View All</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-zinc-100 flex-1">
            {jobs.length > 0 ? (
              jobs.map((job: Job) => (
                <div
                  key={job.id}
                  className="p-5 hover:bg-zinc-50/40 transition flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <h3 className="font-semibold text-zinc-900 text-sm truncate">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-zinc-400">
                      <span className="flex items-center gap-1">
                        <MapPin size={12} /> {job.location || "Remote"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-bold bg-zinc-100 px-2 py-1 rounded text-zinc-700 block">
                        {job._count?.applications || 0} Applicants
                      </span>
                    </div>
                    <div className="p-1.5 rounded-md text-zinc-400">
                      <Link
                        href={`/company/applications`}
                        className="inline-flex items-center gap-0.5 text-zinc-400 hover:text-zinc-950 transition"
                      >
                        <span className="sr-only">View Job Details</span>
                        <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-zinc-400 italic">
                No job openings created or posted yet.
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Log Feed of Inbound Pipelines */}
        <div className="bg-white border border-zinc-200/80 rounded-xl shadow-xs overflow-hidden flex flex-col">
          <div className="border-b border-zinc-100 p-5 bg-zinc-50/50">
            <h2 className="font-bold text-zinc-950 text-sm">Recent Activity</h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Real-time dynamic applications tracking log.
            </p>
          </div>

          <div className="divide-y divide-zinc-100 overflow-y-auto flex-1 max-h-[380px]">
            {applications.length > 0 ? (
              applications.slice(0, 5).map((app) => (
                <div
                  key={app.id}
                  className="p-4 flex items-start justify-between gap-3 text-xs"
                >
                  <div className="min-w-0 space-y-0.5">
                    <h4 className="font-bold text-zinc-800 truncate">
                      {app.student?.fullName || "Candidate Evaluation"}
                    </h4>
                    <p className="text-zinc-400 text-[11px] truncate">
                      Role:{" "}
                      <span className="font-medium text-zinc-600">
                        {app.job?.title || "N/A"}
                      </span>
                    </p>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold tracking-wide border shrink-0 ${
                      app.status === "PENDING"
                        ? "bg-amber-50 text-amber-700 border-amber-100"
                        : app.status === "SHORTLISTED"
                          ? "bg-zinc-900 text-white border-zinc-950"
                          : app.status === "ACCEPTED"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                            : "bg-rose-50 text-rose-700 border-rose-100"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-zinc-400 italic">
                No recent candidates evaluated in your pipeline.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recruitment Phase Breakdown Summary */}
      <div className="bg-white border border-zinc-200/80 rounded-xl p-5 shadow-xs">
        <h2 className="font-bold text-zinc-900 text-sm mb-4">
          Recruitment Phase Summary
        </h2>

        <div className="grid grid-cols-3 gap-4 border border-zinc-100 rounded-lg p-4 bg-zinc-50/30">
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-zinc-900">{applied}</h3>
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
              Pending Review
            </p>
          </div>
          <div className="text-center space-y-1 border-x border-zinc-200/60">
            <h3 className="text-xl font-bold text-zinc-900">{shortlisted}</h3>
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider font-semibold">
              Shortlisted
            </p>
          </div>
          <div className="text-center space-y-1">
            <h3 className="text-xl font-bold text-emerald-600">{hired}</h3>
            <p className="text-[11px] font-medium text-zinc-400 uppercase tracking-wider">
              Confirmed Hires
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
