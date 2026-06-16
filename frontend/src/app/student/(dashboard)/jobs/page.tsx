"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import {
  MapPin,
  Briefcase,
  ArrowRight,
  Layers,
  Search,
  X,
  Clock,
  Bookmark,
  SlidersHorizontal,
  Loader2,
  AlertCircle,
  Building2,
} from "lucide-react";

interface Job {
  id: string;
  title: string;
  location: string | null;
  jobType: string;
  workMode: string;
  salaryMin: number | null;
  salaryMax: number | null;
  salaryCurrency?: string;
  skills: string[];
  isFeatured?: boolean;
  createdAt: string;
  applicationDeadline?: string;
  createdBy?: {
    companyProfile?: {
      companyName: string;
      logoUrl?: string;
    };
  };
  _count?: {
    applications: number;
  };
}

interface Filters {
  search: string;
  jobType: string;
  workMode: string;
  location: string;
  minSalary: number;
}

interface JobsApiResponse {
  jobs?: {
    data: Job[];
  };
}

export default function StudentJobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    jobType: "",
    workMode: "",
    location: "",
    minSalary: 0,
  });
  const [savedJobs, setSavedJobs] = useState<Set<string>>(() => {
    if (typeof window === "undefined") {
      return new Set();
    }

    const saved = localStorage.getItem("savedJobs");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    let isActive = true;

    const loadJobs = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await apiFetch<JobsApiResponse>("/jobs?limit=50");

        if (isActive) {
          setJobs(res.jobs?.data ?? []);
        }
      } catch (err: unknown) {
        if (isActive) {
          setError(
            "Unable to sync current opportunity directory." +
              (err instanceof Error ? ` (${err.message})` : ""),
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadJobs();

    return () => {
      isActive = false;
    };
  }, []);

  // 🔥 FIX 1: Computed state filtering using useMemo
  // This automatically recalculates your matching jobs list whenever `jobs` or `filters` change.
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      // 1. Search Query Match (Title, Company Name, or Skills array match)
      if (filters.search.trim() !== "") {
        const searchLower = filters.search.toLowerCase();
        const matchesTitle = job.title.toLowerCase().includes(searchLower);
        const matchesCompany = job.createdBy?.companyProfile?.companyName
          ?.toLowerCase()
          .includes(searchLower);
        const matchesSkills = job.skills.some((skill) =>
          skill.toLowerCase().includes(searchLower),
        );

        if (!matchesTitle && !matchesCompany && !matchesSkills) return false;
      }

      // 2. Job Type Filter Match
      if (filters.jobType && job.jobType !== filters.jobType) {
        return false;
      }

      // 3. Work Mode Filter Match
      if (filters.workMode && job.workMode !== filters.workMode) {
        return false;
      }

      // 4. Location Filter Match
      if (filters.location.trim() !== "") {
        const locLower = filters.location.toLowerCase();
        const jobLoc = job.location?.toLowerCase() || "remote";
        if (!jobLoc.includes(locLower)) return false;
      }

      return true;
    });
  }, [jobs, filters]);

  const toggleSaveJob = (jobId: string) => {
    setSavedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) newSet.delete(jobId);
      else newSet.add(jobId);
      localStorage.setItem("savedJobs", JSON.stringify(Array.from(newSet)));
      return newSet;
    });
  };

  const formatSalary = (
    min: number | null,
    max: number | null,
    currency: string = "USD",
  ) => {
    if (!min && !max) return "Competitive";
    if (min && max)
      return `${min.toLocaleString()} - ${max.toLocaleString()} ${currency}`;
    return min
      ? `From ${min.toLocaleString()} ${currency}`
      : `Up to ${max?.toLocaleString()} ${currency}`;
  };

  if (loading) {
    return (
      <div className="flex flex-col h-[60vh] items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#08a4a3]" />
        <p className="text-sm font-bold text-[#272d68]/60 uppercase tracking-widest">
          Scanning Opportunities...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#272d68] tracking-tight">
            Discover Opportunities
          </h1>
          <p className="text-sm font-medium text-[#272d68]/60">
            {/* Changed from jobs.length to filteredJobs.length to reflect matches */}
            {filteredJobs.length} active position
            {filteredJobs.length !== 1 ? "s" : ""} currently matching the
            network.
          </p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-bold text-sm transition-all ${
            showFilters
              ? "bg-[#272d68] text-white border-[#272d68]"
              : "bg-white text-[#272d68] border-[#272d68]/10 hover:border-[#08a4a3]/30"
          }`}
        >
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filters</span>
          {showFilters && <X className="w-4 h-4 ml-1 opacity-60" />}
        </button>
      </div>

      {/* Search & Filters Block */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#272d68]/30 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by job title, core skills, or company name..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({ ...prev, search: e.target.value }))
            }
            className="w-full pl-12 pr-4 py-4 bg-white border border-[#272d68]/10 rounded-2xl text-[#272d68] font-semibold shadow-sm focus:ring-4 focus:ring-[#08a4a3]/5 focus:border-[#08a4a3]/40 outline-none transition-all"
          />
        </div>

        {showFilters && (
          <div className="p-6 bg-white border border-[#272d68]/10 rounded-2xl shadow-sm animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#272d68]/60 uppercase ml-1">
                  Job Type
                </label>
                <select
                  className="w-full p-2.5 bg-gray-50 border border-[#272d68]/5 rounded-xl text-sm font-bold text-[#272d68] outline-none focus:border-[#08a4a3]"
                  value={filters.jobType}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, jobType: e.target.value }))
                  }
                >
                  <option value="">All Types</option>
                  <option value="FULL_TIME">Full Time</option>
                  <option value="PART_TIME">Part Time</option>
                  <option value="INTERNSHIP">Internship</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#272d68]/60 uppercase ml-1">
                  Work Mode
                </label>
                <select
                  className="w-full p-2.5 bg-gray-50 border border-[#272d68]/5 rounded-xl text-sm font-bold text-[#272d68] outline-none focus:border-[#08a4a3]"
                  value={filters.workMode}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, workMode: e.target.value }))
                  }
                >
                  <option value="">All Modes</option>
                  <option value="REMOTE">Remote</option>
                  <option value="HYBRID">Hybrid</option>
                  <option value="ONSITE">On-site</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#272d68]/60 uppercase ml-1">
                  Location
                </label>
                <input
                  type="text"
                  placeholder="City or Country"
                  className="w-full p-2.5 bg-gray-50 border border-[#272d68]/5 rounded-xl text-sm font-bold text-[#272d68] outline-none focus:border-[#08a4a3]"
                  value={filters.location}
                  onChange={(e) =>
                    setFilters((p) => ({ ...p, location: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-50 flex justify-end">
              <button
                onClick={() =>
                  setFilters({
                    search: "",
                    jobType: "",
                    workMode: "",
                    location: "",
                    minSalary: 0,
                  })
                }
                className="text-xs font-bold text-[#272d68]/40 hover:text-rose-500 mr-6"
              >
                Reset All
              </button>
              {/* 🔥 FIX 2: Removed API re-fetch on click, closed panel instead since it handles filters smoothly live on typing */}
              <button
                onClick={() => setShowFilters(false)}
                className="bg-[#272d68] text-white px-6 py-2 rounded-xl text-sm font-bold hover:bg-[#1e3d64]"
              >
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Error State */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl flex items-center gap-3 text-rose-700 text-sm font-bold">
          <AlertCircle className="w-5 h-5 text-rose-500" />
          {error}
        </div>
      )}

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 gap-4">
        {/* 🔥 FIX 3: Changed to map filteredJobs instead of jobs */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white border border-[#272d68]/10 rounded-3xl">
            <Briefcase className="w-12 h-12 text-[#272d68]/10 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-[#272d68]">
              No matching roles found
            </h3>
            <p className="text-sm text-[#272d68]/50 mt-1">
              Try adjusting your search filters or keywords.
            </p>
          </div>
        ) : (
          filteredJobs.map((job) => {
            const isSaved = savedJobs.has(job.id);
            const logoUrl = job.createdBy?.companyProfile?.logoUrl;

            const companyName =
              job.createdBy?.companyProfile?.companyName || "Verified Employer";
            return (
              <div
                key={job.id}
                className="group bg-white border border-[#272d68]/10 rounded-2xl p-5 md:p-6 shadow-sm hover:shadow-md hover:border-[#08a4a3]/30 transition-all duration-300"
              >
                {/* ... Inner card layout content remains identical ... */}
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div className="flex items-start justify-between sm:justify-start gap-4">
                      <div className="w-14 h-14 bg-slate-50 border border-gray-100 rounded-xl flex items-center justify-center overflow-hidden">
                        {logoUrl ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}${logoUrl}`}
                            alt={companyName}
                            width={56}
                            height={56}
                            unoptimized
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <Building2 className="w-7 h-7 text-[#272d68]/40" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-lg font-extrabold text-[#272d68] leading-tight">
                            {job.title}
                          </h2>
                          {job.isFeatured && (
                            <span className="bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-bold px-2 py-0.5 rounded-md uppercase">
                              Featured
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-[#08a4a3]">
                          {companyName}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleSaveJob(job.id)}
                        className="sm:hidden p-2 text-gray-300 hover:text-amber-500"
                      >
                        <Bookmark
                          className={`w-5 h-5 ${isSaved ? "fill-amber-500 text-amber-500" : ""}`}
                        />
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-y-2 gap-x-4">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#272d68]/50">
                        <MapPin className="w-3.5 h-3.5 text-[#272d68]/30" />
                        {job.location || "Remote"}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#272d68]/50">
                        <Clock className="w-3.5 h-3.5 text-[#272d68]/30" />
                        {job.jobType.replace("_", " ")}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-bold text-[#272d68]/50">
                        <Layers className="w-3.5 h-3.5 text-[#272d68]/30" />
                        {job.workMode}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs font-extrabold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {formatSalary(job.salaryMin, job.salaryMax)}
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {job.skills.slice(0, 4).map((skill, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-bold px-2.5 py-1 bg-gray-50 text-[#272d68]/60 border border-gray-200/60 rounded-lg"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 4 && (
                        <span className="text-[10px] font-bold text-[#272d68]/30 self-center">
                          +{job.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center lg:flex-col lg:justify-between gap-4 border-t border-gray-50 pt-4 lg:border-none lg:pt-0">
                    <button
                      onClick={() => toggleSaveJob(job.id)}
                      className={`hidden sm:flex p-2.5 rounded-xl border transition-all ${
                        isSaved
                          ? "bg-amber-50 border-amber-200 text-amber-500"
                          : "bg-white border-[#272d68]/10 text-gray-300 hover:text-amber-500 hover:border-amber-200"
                      }`}
                    >
                      <Bookmark
                        className={`w-5 h-5 ${isSaved ? "fill-amber-500" : ""}`}
                      />
                    </button>
                    <Link
                      href={`/student/jobs/${job.id}`}
                      className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-[#272d68] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#1e3d64] shadow-sm shadow-[#272d68]/10 transition-all active:scale-[0.98]"
                    >
                      View Details
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
