"use client";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import {
  User,
  Briefcase,
  CheckCircle2,
  MapPin,
  Clock,
  ArrowRight,
  Building2,
  Calendar,
  Mail,
  Phone,
  Globe,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { LiaLinkedin } from "react-icons/lia";
import { BsGithub } from "react-icons/bs";
import { Application, StudentApplicationsResponse } from "@/types/application";
import { StudentProfile } from "@/types/student";

export default function StudentDashboardHome() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [appliedJobs, setAppliedJobs] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [missingItems, setMissingItems] = useState<string[]>([]);
  const [stats, setStats] = useState({
    totalApplications: 0,
    pendingApplications: 0,
    profileCompleteness: 0,
  });

  useEffect(() => {
    let isActive = true;

    const loadDashboardData = async () => {
      try {
        if (isActive) {
          setLoading(true);
        }

        const [profileData, appsData] = await Promise.all([
          apiFetch<StudentProfile>("/profiles/student/me"),
          apiFetch<StudentApplicationsResponse>("/applications/my"),
        ]);

        if (!isActive) return;

        setProfile(profileData);

        const rawApps: Application[] = appsData?.applications || appsData || [];

        setAppliedJobs(rawApps.slice(0, 4));

        const totalApps = rawApps.length;

        const pendingApps = rawApps.filter(
          (app) => app.status === "PENDING" || app.status === "REVIEWED",
        ).length;

        const calculateProfileCompleteness = (profile: StudentProfile) => {
          let score = 0;

          if (profile.firstName) score += 5;
          if (profile.lastName) score += 5;
          if (profile.phone) score += 5;
          if (profile.address) score += 5;

          if (profile.headline) score += 10;
          if (profile.bio) score += 10;

          if (profile.imageUrl) score += 10;
          if (profile.resumeUrl) score += 15;

          if (profile.skills?.length) score += 10;
          if (profile.experience?.length) score += 10;
          if (profile.education?.length) score += 10;

          if (profile.certifications?.length) score += 5;

          if (profile.portfolioUrl) score += 5;
          if (profile.linkedin) score += 3;
          if (profile.github) score += 2;

          return Math.min(score, 100);
        };

        const completeness = profileData
          ? calculateProfileCompleteness(profileData)
          : 0;

        const missing: string[] = [];

        if (!profileData?.imageUrl) missing.push("Profile Photo");
        if (!profileData?.resumeUrl) missing.push("Resume");
        if (!profileData?.skills?.length) missing.push("Skills");
        if (!profileData?.experience?.length) missing.push("Experience");
        if (!profileData?.education?.length) missing.push("Education");
        if (!profileData?.certifications?.length)
          missing.push("Certifications");
        if (!profileData?.linkedin) missing.push("LinkedIn");
        if (!profileData?.github) missing.push("GitHub");

        setMissingItems(missing);

        setStats({
          totalApplications: totalApps,
          pendingApplications: pendingApps,
          profileCompleteness: completeness,
        });
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadDashboardData();

    return () => {
      isActive = false;
    };
  }, []);

  const getDisplayName = () => {
    if (profile?.firstName || profile?.lastName) {
      return `${profile.firstName} ${profile.lastName}`.trim();
    }
    return "Complete Your Profile";
  };

  const getInitials = () => {
    if (profile?.firstName || profile?.lastName) {
      const first = profile.firstName?.charAt(0) || "";
      const last = profile.lastName?.charAt(0) || "";
      return (first + last).toUpperCase();
    }
    return "ST";
  };

  const getStatusBadgeStyles = (status: string) => {
    const s = status.toUpperCase();
    if (s === "ACCEPTED" || s === "HIRED") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (s === "REJECTED" || s === "REJECT") {
      return "bg-rose-50 text-rose-700 border-rose-200";
    }
    if (s === "REVIEWED" || s === "INTERVIEW") {
      return "bg-blue-50 text-blue-700 border-blue-200";
    }
    return "bg-[#ceeeed]/50 text-[#08a4a3] border-[#08a4a3]/20";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#ceeeed] rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#08a4a3] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <span className="text-[#272d68]/70 text-sm font-semibold animate-pulse">
          Loading your dashboard...
        </span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
      {/* Welcome Header */}
      <div className="bg-linear-to-r from-[#272d68] to-[#08a4a3] rounded-2xl p-6 text-white">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-5 h-5 text-yellow-300" />
          <span className="text-sm font-semibold">Student Dashboard</span>
        </div>
        <h1 className="text-2xl font-extrabold">
          Welcome back,{" "}
          {profile?.firstName && profile.lastName
            ? `${profile.firstName} ${profile.lastName}`
            : "Candidate"}
          ! 👋
        </h1>
        <p className="text-white/80 text-sm mt-1">
          {profile?.headline || "Ready to find your next opportunity?"}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-[#272d68]/10 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#272d68]/60 font-medium">
                Total Applications
              </p>
              <p className="text-2xl font-bold text-[#272d68]">
                {stats.totalApplications}
              </p>
            </div>
            <div className="w-10 h-10 bg-[#ceeeed]/30 rounded-lg flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-[#08a4a3]" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[#272d68]/10 p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#272d68]/60 font-medium">
                Profile Completeness
              </p>
              <p className="text-2xl font-bold text-[#08a4a3]">
                {stats.profileCompleteness}%
              </p>
              {missingItems.length > 0 && (
                <p className="text-xs text-orange-600 mt-1">
                  Missing: {missingItems.join(", ")}
                </p>
              )}
            </div>
            <div className="w-10 h-10 bg-[#ceeeed]/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#08a4a3]" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT COLUMN - Profile Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-[#272d68]/10 shadow-sm overflow-hidden sticky top-6">
            {/* Profile Header */}
            <div className="bg-linear-to-r from-[#272d68] to-[#08a4a3] p-6 text-center">
              <div className="w-24 h-24 mx-auto bg-white rounded-2xl flex items-center justify-center overflow-hidden shadow-lg mb-3">
                {profile?.imageUrl ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${profile.imageUrl}`}
                    alt={getDisplayName()}
                    width={96}
                    height={96}
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-[#272d68] font-black text-3xl">
                    {getInitials()}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-white">
                {getDisplayName()}
              </h2>
              <p className="text-white/80 text-sm mt-1">
                {profile?.headline || "Student"}
              </p>
            </div>

            {/* Profile Details */}
            <div className="p-5 space-y-4">
              {profile?.email && (
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-[#08a4a3]" />
                  <span className="text-[#272d68]/70">{profile.email}</span>
                </div>
              )}

              {profile?.phone && (
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-[#08a4a3]" />
                  <span className="text-[#272d68]/70">{profile.phone}</span>
                </div>
              )}

              {profile?.address && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-[#08a4a3]" />
                  <span className="text-[#272d68]/70">{profile.address}</span>
                </div>
              )}

              {/* Skills */}
              {profile?.skills && profile.skills.length > 0 && (
                <div className="pt-3 border-t border-[#272d68]/10">
                  <p className="text-xs font-semibold text-[#272d68]/60 mb-2">
                    Skills
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.slice(0, 5).map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-[#ceeeed]/30 px-2 py-1 rounded-lg text-xs text-[#272d68]"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="flex gap-3 pt-3 border-t border-[#272d68]/10">
                {profile?.github && (
                  <Link
                    href={profile.github}
                    target="_blank"
                    className="text-[#272d68]/50 hover:text-[#08a4a3]"
                  >
                    <BsGithub className="w-4 h-4" />
                  </Link>
                )}
                {profile?.linkedin && (
                  <Link
                    href={profile.linkedin}
                    target="_blank"
                    className="text-[#272d68]/50 hover:text-[#08a4a3]"
                  >
                    <LiaLinkedin className="w-4 h-4" />
                  </Link>
                )}
                {profile?.portfolioUrl && (
                  <Link
                    href={profile.portfolioUrl}
                    target="_blank"
                    className="text-[#272d68]/50 hover:text-[#08a4a3]"
                  >
                    <Globe className="w-4 h-4" />
                  </Link>
                )}
              </div>

              {/* Edit Profile Button */}
              <Link
                href="/student/profile"
                className="w-full flex items-center justify-center gap-2 bg-[#272d68] text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-[#08a4a3] transition-all duration-300 mt-2"
              >
                <User className="w-4 h-4" />
                Edit Profile
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Jobs Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applied Jobs Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-extrabold text-[#272d68] flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                Your Applications
              </h2>
              <Link
                href="/student/applications"
                className="text-xs font-semibold text-[#08a4a3] hover:underline flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <div className="space-y-3">
              {appliedJobs.length === 0 ? (
                <div className="p-12 text-center bg-white border border-[#272d68]/10 rounded-xl">
                  <p className="text-sm text-[#272d68]/50">
                    You haven&apos;t applied to any jobs yet.
                  </p>
                  <Link
                    href="/student/jobs"
                    className="text-[#08a4a3] text-sm font-semibold mt-2 inline-block"
                  >
                    Start Applying →
                  </Link>
                </div>
              ) : (
                appliedJobs.map((application) => (
                  <Link
                    key={application.id}
                    href={`/student/jobs/${application.job.id}`}
                    className="block bg-white rounded-xl border border-[#272d68]/10 p-5 hover:shadow-md transition-all duration-300"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-2">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full border ${getStatusBadgeStyles(application.status)}`}
                          >
                            {application.status}
                          </span>
                          <span className="text-xs text-[#272d68]/50 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            Applied {formatDate(application.createdAt)}
                          </span>
                        </div>

                        <h3 className="font-extrabold text-[#272d68]">
                          {application.job.title}
                        </h3>
                        <p className="text-sm font-semibold text-[#08a4a3]/80 mt-1 flex items-center gap-1">
                          <Building2 className="w-3.5 h-3.5" />
                          {application.job.createdBy?.companyProfile
                            ?.companyName || "Direct Client"}
                        </p>

                        <div className="flex flex-wrap items-center gap-3 text-xs font-medium text-[#272d68]/60 mt-2">
                          <span className="flex items-center gap-1">
                            <MapPin className="w-3.5 h-3.5" />{" "}
                            {application.job.location || "Remote"}
                          </span>
                          <span>•</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />{" "}
                            {application.job.workMode}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Quick Action Banner */}
          <div className="bg-linear-to-r from-[#ceeeed]/30 to-white rounded-xl border border-[#08a4a3]/20 p-5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-[#272d68]">
                  Ready for your next opportunity?
                </h3>
                <p className="text-sm text-[#272d68]/60">
                  Browse through thousands of jobs and find your perfect match.
                </p>
              </div>
              <Link
                href="/student/jobs"
                className="bg-linear-to-r from-[#272d68] to-[#08a4a3] text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all duration-300 whitespace-nowrap"
              >
                Browse Jobs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
