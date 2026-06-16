"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  Users,
  Building2,
  Briefcase,
  FileText,
  Clock,
  CheckCircle2,
  RefreshCw,
} from "lucide-react";
import { DashboardStats } from "@/types/dashboard";


export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setIsRefreshing(true);
      const data = await apiFetch<DashboardStats>("/admin/stats");
      setStats(data);
    } catch (error) {
      console.error("Admin Stats Fetch Error:", error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchStats();
    };

    void load();
  }, []);

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-[#08a4a3]" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#272d68]">
            Platform Overview
          </h1>
          <p className="text-sm font-medium text-[#272d68]/60">
            Real-time system metrics and entity distribution
          </p>
        </div>
        <button
          onClick={fetchStats}
          disabled={isRefreshing}
          className="flex items-center justify-center gap-2 rounded-xl border border-[#272d68]/10 bg-white px-4 py-2.5 text-sm font-bold text-[#272d68] hover:bg-gray-50 active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm"
        >
          <RefreshCw
            className={`h-4 w-4 text-[#08a4a3] ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh Metrics
        </button>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard
          title="Total Students"
          value={stats?.totalStudents ?? 0}
          icon={<Users className="h-5 w-5 text-indigo-600" />}
          description="Registered candidates"
          badgeColor="bg-indigo-50 border-indigo-100"
        />
        <StatCard
          title="Total Companies"
          value={stats?.totalCompanies ?? 0}
          icon={<Building2 className="h-5 w-5 text-[#272d68]" />}
          description="Employer accounts"
          badgeColor="bg-blue-50 border-blue-100"
        />
        <StatCard
          title="Live Jobs"
          value={stats?.totalJobs ?? 0}
          icon={<Briefcase className="h-5 w-5 text-[#08a4a3]" />}
          description="Currently active posts"
          badgeColor="bg-[#ceeeed] border-[#08a4a3]/20"
        />
        <StatCard
          title="Applications"
          value={stats?.totalApplications ?? 0}
          icon={<FileText className="h-5 w-5 text-amber-600" />}
          description="Total submissions"
          badgeColor="bg-amber-50 border-amber-100"
        />
      </div>

      {/* Verification Pipeline Section */}
      <div className="rounded-2xl border border-[#272d68]/10 bg-white overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 divide-y divide-[#272d68]/10 lg:grid-cols-2 lg:divide-y-0 lg:divide-x">
          {/* Pending Block */}
          <div className="p-6 md:p-8 bg-linear-to-b from-white to-amber-55/10">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                <Clock className="h-6 w-6 text-amber-600" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#272d68]/60">
                  Pending Verification
                </p>
                <h3 className="text-3xl font-extrabold text-[#272d68] mt-0.5">
                  {stats?.pendingCompanies ?? 0}
                </h3>
              </div>
            </div>
            <p className="mt-4 text-xs font-medium text-[#272d68]/70">
              Employer profiles awaiting manual dashboard approval before
              getting active permissions.
            </p>
          </div>

          {/* Approved Block */}
          <div className="p-6 md:p-8 bg-linear-to-b from-white to-[#ceeeed]/20">
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-[#ceeeed] border border-[#08a4a3]/20 p-3">
                <CheckCircle2 className="h-6 w-6 text-[#08a4a3]" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#272d68]/60">
                  Approved Partners
                </p>
                <h3 className="text-3xl font-extrabold text-[#272d68] mt-0.5">
                  {stats?.approvedCompanies ?? 0}
                </h3>
              </div>
            </div>
            <p className="mt-4 text-xs font-medium text-[#272d68]/70">
              Verified corporate entities actively establishing connections and
              posting listings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  description,
  badgeColor,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  description: string;
  badgeColor: string;
}) {
  return (
    <div className="rounded-2xl border border-[#272d68]/10 bg-white p-6 shadow-sm hover:border-[#08a4a3]/30 transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#272d68]/50">
            {title}
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-[#272d68] tracking-tight">
            {value.toLocaleString()}
          </h2>
        </div>
        <div
          className={`rounded-xl border p-2.5 shadow-sm transition-transform duration-300 group-hover:scale-110 ${badgeColor}`}
        >
          {icon}
        </div>
      </div>
      <p className="mt-4 text-xs font-semibold text-[#272d68]/60">
        {description}
      </p>
    </div>
  );
}
