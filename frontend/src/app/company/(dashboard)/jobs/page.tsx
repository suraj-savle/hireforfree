"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import Link from "next/link";
import {
  Briefcase,
  MapPin,
  Trash2,
  Building2,
  Calendar,
  Loader2,
  AlertCircle,
  Pencil,
} from "lucide-react";
import { Job, JobsResponse } from "@/types/job";

export default function CompanyJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  // Fetch jobs safely unboxing your nested response.jobs.data payload
  useEffect(() => {
    let isActive = true;

    const fetchJobs = async () => {
      try {
        setError(null);

        const response = await apiFetch<JobsResponse>("/jobs/my-company-jobs");


        if (!isActive) return;

        setJobs(response.jobs  || []);
      } catch (err: unknown) {
        console.error("Failed to load jobs list:", err);

        if (isActive) {
          setError(
            "Unable to synchronize your active job listings. Please try again.",
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };
    void fetchJobs();

    return () => {
      isActive = false;
    };
  }, []);
  const handleDeleteJob = async (id: string) => {
    if (
      !window.confirm(
        "Are you sure you want to permanently delete this job post?",
      )
    )
      return;

    try {
      setDeletingId(id);
      setError(null);

      await apiFetch(`/jobs/${id}`, {
        method: "DELETE",
      });

      setJobs((prevJobs) => prevJobs.filter((job) => job.id !== id));
    } catch (err: unknown) {
      console.error("Deletion failed:", err);

      const message =
        err instanceof Error
          ? err.message
          : "Failed to remove the requested job post.";

      setError(message);
    } finally {
      setDeletingId(null);
    }
  };

  // Safe asset path URL resolver utility
  const resolveAssetUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  };

  return (
    <div className="mx-auto max-w-5xl pb-12 space-y-6">
      {/* Header Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-[#272d68] tracking-tight">
            Active Job Openings
          </h1>
          <p className="text-[#272d68]/60 text-sm font-medium mt-1">
            {loading
              ? "Syncing job indexes..."
              : `Displaying ${jobs.length} published job opportunities`}
          </p>
        </div>
      </div>

      {/* Critical System Notifications */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* LOADING STATE */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-32 w-full animate-pulse rounded-2xl border border-[#272d68]/5 bg-white shadow-xs"
            />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#272d68]/20 bg-white p-16 text-center shadow-xs">
          <div className="rounded-xl bg-[#ceeeed] p-3 text-[#08a4a3] mb-4">
            <Briefcase className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-black text-[#272d68]">
            No vacancies discovered
          </h3>
          <p className="mx-auto mt-1 max-w-sm text-xs font-medium text-[#272d68]/50">
            You have not posted any live listings yet. Get started by publishing
            your first job opening to the candidate stream.
          </p>
        </div>
      ) : (
        /* CORE DATA LIST */
        <div className="space-y-4">
          {jobs.map((job) => {
            const companyName =
              job.createdBy?.companyProfile?.companyName || "Verified Partner";
            const logoPath = job.createdBy?.companyProfile?.logoUrl;

            const formattedDate = job.createdAt
              ? new Date(job.createdAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : null;

            return (
              <div
                key={job.id}
                className="group relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-[#272d68]/10 bg-white p-5 md:p-6 shadow-xs hover:border-[#08a4a3]/30 transition-all duration-200"
              >
                <div className="flex items-start gap-4">
                  {/* Dynamic Company Logo / Placeholder Image element */}
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-[#272d68]/10 overflow-hidden text-[#272d68]/40 group-hover:bg-[#ceeeed]/30 group-hover:text-[#08a4a3] transition-colors duration-200 shadow-inner">
                    {logoPath ? (
                      <Image
                        src={resolveAssetUrl(logoPath)}
                        alt={`${companyName} logo`}
                        width={48}
                        height={48}
                        unoptimized
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                          const fallbackIcon = (
                            e.currentTarget as HTMLImageElement
                          ).parentElement?.querySelector(".fallback-svg");
                          if (fallbackIcon)
                            fallbackIcon.classList.remove("hidden");
                        }}
                      />
                    ) : null}
                    <Building2
                      className={`h-5 w-5 fallback-svg ${logoPath ? "hidden" : ""}`}
                    />
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-base md:text-lg font-black text-[#272d68] group-hover:text-[#08a4a3] transition tracking-tight">
                      {job.title}
                    </h2>

                    {/* Meta Info Row */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#272d68]/60 font-semibold">
                      <span className="font-bold text-[#272d68]/80">
                        {companyName}
                      </span>
                      <span className="text-gray-300">•</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 text-[#272d68]/30" />
                        {job.location || "Remote"}
                      </span>
                      {formattedDate && (
                        <>
                          <span className="text-gray-300">•</span>
                          <span className="flex items-center gap-1 font-mono text-[11px]">
                            <Calendar className="h-3.5 w-3.5 text-[#272d68]/30" />
                            {formattedDate}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Badge Attributes Row */}
                    <div className="flex flex-wrap gap-2 pt-1.5">
                      <span className="rounded-lg bg-slate-50 px-2.5 py-0.5 text-xs font-bold text-[#272d68]/70 border border-slate-200">
                        {job.jobType?.replace(/_/g, " ")}
                      </span>
                      <span className="rounded-lg bg-[#ceeeed]/40 px-2.5 py-0.5 text-xs font-bold text-[#08a4a3] border border-[#08a4a3]/10">
                        {job.workMode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Controls Action Row */}
                <div className="flex items-center gap-2 justify-end border-t border-gray-50 pt-3 sm:border-none sm:pt-0">
                  <Link
                    href={`/company/jobs/edit/${job.id}`}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-[#272d68]/15 bg-white px-3.5 py-2 text-xs font-black text-[#272d68] hover:bg-slate-50 hover:border-[#272d68] transition"
                  >
                    <Pencil className="h-3.5 w-3.5 text-[#08a4a3]" />
                    <span>Edit</span>
                  </Link>

                  <button
                    disabled={deletingId === job.id}
                    onClick={() => handleDeleteJob(job.id)}
                    className="flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50/50 px-3.5 py-2 text-xs font-black text-rose-600 hover:bg-rose-50 hover:border-rose-300 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    {deletingId === job.id ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
