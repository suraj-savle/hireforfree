"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import {
  Briefcase,
  User,
  Loader2,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Download,
  Star,
  MessageSquare,
  Users,
  X,
  Globe,
  GraduationCap,
  Code,
  Award,
  Mail as MailIcon,
  Phone as PhoneIcon,
  FileText as FileTextIcon,
} from "lucide-react";
import { LiaLinkedin } from "react-icons/lia";
import { GiThunderBlade } from "react-icons/gi";
import Image from "next/image";
import { Application, ApplicationsResponse } from "@/types/application";

const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; bg: string; icon: typeof Clock }
> = {
  APPLIED: {
    label: "Applied",
    color: "text-blue-700",
    bg: "bg-blue-50",
    icon: Clock,
  },
  SHORTLISTED: {
    label: "Shortlisted",
    color: "text-purple-700",
    bg: "bg-purple-50",
    icon: Star,
  },
  INTERVIEW: {
    label: "Interview",
    color: "text-amber-700",
    bg: "bg-amber-50",
    icon: MessageSquare,
  },
  SELECTED: {
    label: "Selected",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    icon: CheckCircle,
  },
  REJECTED: {
    label: "Rejected",
    color: "text-rose-700",
    bg: "bg-rose-50",
    icon: XCircle,
  },
};

const STATUS_OPTIONS = [
  { value: "APPLIED", label: "Applied" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "SELECTED", label: "Selected" },
  { value: "REJECTED", label: "Rejected" },
];

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false);

  useEffect(() => {
    let isActive = true;

    const loadApplications = async () => {
      try {
        const res = await apiFetch<ApplicationsResponse>("/applications/received");

        if (!isActive) {
          return;
        }

        setApplications(res.applications || []);
      } catch (error) {
        console.error(error);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void loadApplications();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredApps = useMemo(() => {
    if (statusFilter === "ALL") {
      return applications;
    }

    return applications.filter((app) => app.status === statusFilter);
  }, [applications, statusFilter]);

  const updateStatus = async (applicationId: string, newStatus: string) => {
    setUpdating(applicationId);
    try {
      await apiFetch<Application>(`/applications/${applicationId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status: newStatus }),
      });

      setApplications((prev) =>
        prev.map((app) =>
          app.id === applicationId
            ? { ...app, status: newStatus, updatedAt: new Date().toISOString() }
            : app,
        ),
      );

      if (selectedApp?.id === applicationId) {
        setSelectedApp((prev) =>
          prev ? { ...prev, status: newStatus } : null,
        );
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatYear = (year?: number | string | null) => {
    if (!year) return "Present";
    return year.toString();
  };

  const getStatusCount = (status: string) => {
    if (status === "ALL") return applications.length;
    return applications.filter((app) => app.status === status).length;
  };

  const getStudentName = (student: Application["student"]) => {
    const profile = student.studentProfile;
    if (profile?.firstName || profile?.lastName) {
      return `${profile?.firstName || ""} ${profile?.lastName || ""}`.trim();
    }
    return student.email.split("@")[0];
  };

  const getInitials = (student: Application["student"]) => {
    const profile = student.studentProfile;
    const first = profile?.firstName?.charAt(0) || "";
    const last = profile?.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "?";
  };

  const getImageUrl = (url?: string | null) => {
    if (!url) return null;
    if (url.startsWith("http")) return url;
    return `${process.env.NEXT_PUBLIC_API_URL}${url}`;
  };

  const openProfilePanel = (app: Application) => {
    setSelectedApp(app);
    setIsPanelOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeProfilePanel = () => {
    setIsPanelOpen(false);
    setTimeout(() => setSelectedApp(null), 300);
    document.body.style.overflow = "auto";
  };

  if (loading) {
    return (
      <div className="h-[50vh] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#ceeeed] rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#08a4a3] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm font-semibold text-[#272d68]/60">
          Loading applications...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#272d68] tracking-tight">
          Applications
        </h1>
        <p className="text-sm text-[#272d68]/60 mt-1">
          Total: {applications.length} applications
        </p>
      </div>

      {/* Simple Status Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setStatusFilter("ALL")}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
            statusFilter === "ALL"
              ? "bg-linear-to-r from-[#272d68] to-[#08a4a3] text-white shadow-md"
              : "bg-white border border-[#272d68]/10 text-[#272d68]/70 hover:border-[#08a4a3]/30"
          }`}
        >
          All ({getStatusCount("ALL")})
        </button>

        {STATUS_OPTIONS.map((opt) => {
          const count = getStatusCount(opt.value);
          const config = STATUS_CONFIG[opt.value];
          const isActive = statusFilter === opt.value;

          return (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? `${config.bg} ${config.color} border`
                  : "bg-white border border-[#272d68]/10 text-[#272d68]/50 hover:border-[#08a4a3]/30"
              }`}
            >
              {opt.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="bg-white border border-[#272d68]/10 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 mx-auto bg-[#ceeeed]/30 rounded-full flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-[#08a4a3]" />
          </div>
          <h3 className="text-lg font-bold text-[#272d68] mb-2">
            No applications
          </h3>
          <p className="text-sm text-[#272d68]/50">
            No applications found for this status
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const student = app.student.studentProfile;
            const statusConfig =
              STATUS_CONFIG[app.status] || STATUS_CONFIG.APPLIED;
            const StatusIcon = statusConfig.icon;
            const isUpdating = updating === app.id;
            const imageUrl = getImageUrl(student?.imageUrl);

            return (
              <div
                key={app.id}
                className="bg-white border border-[#272d68]/10 rounded-2xl p-5 hover:shadow-md transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  {/* Left - Candidate Info */}
                  <div className="flex-1">
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="relative w-14 h-14 rounded-xl bg-linear-to-br from-[#272d68] to-[#08a4a3] flex items-center justify-center text-white font-bold text-lg shadow-md shrink-0 overflow-hidden">
                        {imageUrl ? (
                          <Image
                            src={imageUrl}
                            alt={getStudentName(app.student)}
                            fill
                            unoptimized
                            className="object-cover"
                          />
                        ) : (
                          getInitials(app.student)
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="font-bold text-lg text-[#272d68]">
                            {getStudentName(app.student)}
                          </h3>
                          <span
                            className={`px-2 py-0.5 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.color}`}
                          >
                            <StatusIcon className="w-3 h-3 inline mr-1" />
                            {statusConfig.label}
                          </span>
                        </div>

                        {student?.headline && (
                          <p className="text-sm text-[#08a4a3] font-medium">
                            {student.headline}
                          </p>
                        )}

                        <div className="flex flex-wrap gap-3 mt-2 text-xs text-[#272d68]/60">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {app.student.email}
                          </span>
                          {student?.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" />
                              {student.phone}
                            </span>
                          )}
                        </div>

                        {/* Job Info */}
                        <div className="mt-3 pt-3 border-t border-[#272d68]/10">
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-[#08a4a3]" />
                            <span className="font-semibold text-[#272d68]">
                              {app.job.title}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-3 mt-1 text-xs text-[#272d68]/50">
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3" />
                              {app.job.location || "Remote"}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Applied: {formatDate(app.createdAt)}
                            </span>
                          </div>
                        </div>

                        {/* Skills Preview */}
                        {student?.skills && student.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mt-3">
                            {student.skills.slice(0, 3).map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 text-xs bg-[#ceeeed]/40 rounded-lg text-[#272d68]/70"
                              >
                                {skill}
                              </span>
                            ))}
                            {student.skills.length > 3 && (
                              <span className="px-2 py-0.5 text-xs text-[#272d68]/40">
                                +{student.skills.length - 3}
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right - Actions */}
                  <div className="flex flex-row md:flex-col gap-2">
                    {/* Status Dropdown */}
                    <div className="relative">
                      <select
                        value={app.status}
                        onChange={(e) => updateStatus(app.id, e.target.value)}
                        disabled={isUpdating}
                        className="px-3 py-2 pr-7 text-sm font-semibold rounded-xl border border-[#272d68]/10 bg-white text-[#272d68] focus:outline-none focus:ring-2 focus:ring-[#08a4a3]/20 appearance-none cursor-pointer"
                      >
                        {STATUS_OPTIONS.map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
                        {isUpdating ? (
                          <Loader2 className="w-3 h-3 animate-spin text-[#08a4a3]" />
                        ) : (
                          <svg
                            className="w-3 h-3 text-[#272d68]/40"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        )}
                      </div>
                    </div>

                    {/* View Button */}
                    <button
                      onClick={() => openProfilePanel(app)}
                      className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold rounded-xl bg-[#272d68] text-white hover:bg-[#08a4a3] transition-all"
                    >
                      <Eye className="w-4 h-4" />
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Right Slide-out Profile Panel */}
      {isPanelOpen && selectedApp && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
            onClick={closeProfilePanel}
          />

          {/* Panel */}
          <div className="fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-out overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-[#272d68]/10 p-5 flex justify-between items-center z-10">
              <div className="flex items-center gap-2">
                <User className="w-5 h-5 text-[#08a4a3]" />
                <h2 className="text-xl font-bold text-[#272d68]">
                  Complete Profile
                </h2>
              </div>
              <button
                onClick={closeProfilePanel}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-[#272d68]/60" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Hero Section */}
              <div className="flex flex-col items-center text-center border-b border-[#272d68]/10 pb-6">
                <div className="w-28 h-28 rounded-2xl bg-linear-to-br from-[#272d68] to-[#08a4a3] flex items-center justify-center text-white font-bold text-3xl shadow-lg overflow-hidden mb-4">
                  {getImageUrl(selectedApp.student.studentProfile?.imageUrl) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={
                        getImageUrl(
                          selectedApp.student.studentProfile?.imageUrl,
                        )!
                      }
                      alt={getStudentName(selectedApp.student)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    getInitials(selectedApp.student)
                  )}
                </div>
                <h3 className="text-2xl font-bold text-[#272d68]">
                  {getStudentName(selectedApp.student)}
                </h3>
                <p className="text-[#08a4a3] font-medium mt-1">
                  {selectedApp.student.studentProfile?.headline || "Candidate"}
                </p>
                <div className="flex gap-2 mt-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_CONFIG[selectedApp.status]?.bg} ${STATUS_CONFIG[selectedApp.status]?.color}`}
                  >
                    {STATUS_CONFIG[selectedApp.status]?.label}
                  </span>
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#272d68] flex items-center gap-2 text-sm uppercase tracking-wider">
                  <MailIcon className="w-4 h-4 text-[#08a4a3]" /> Contact
                  Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-[#08a4a3]" />
                    <span className="text-[#272d68]/70">
                      {selectedApp.student.email}
                    </span>
                  </div>
                  {selectedApp.student.studentProfile?.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <PhoneIcon className="w-4 h-4 text-[#08a4a3]" />
                      <span className="text-[#272d68]/70">
                        {selectedApp.student.studentProfile.phone}
                      </span>
                    </div>
                  )}
                  {selectedApp.student.studentProfile?.address && (
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-[#08a4a3]" />
                      <span className="text-[#272d68]/70">
                        {selectedApp.student.studentProfile.address}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Social Links */}
              {(selectedApp.student.studentProfile?.linkedin ||
                selectedApp.student.studentProfile?.github ||
                selectedApp.student.studentProfile?.portfolioUrl) && (
                <div className="space-y-3">
                  <h4 className="font-bold text-[#272d68] flex items-center gap-2 text-sm uppercase tracking-wider">
                    <Globe className="w-4 h-4 text-[#08a4a3]" /> Social & Links
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {selectedApp.student.studentProfile?.linkedin && (
                      <a
                        href={selectedApp.student.studentProfile.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-[#0077b5]/10 rounded-lg text-[#0077b5] text-sm hover:bg-[#0077b5]/20 transition"
                      >
                        <LiaLinkedin className="w-4 h-4" /> LinkedIn
                      </a>
                    )}
                    {selectedApp.student.studentProfile?.github && (
                      <a
                        href={selectedApp.student.studentProfile.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg text-gray-700 text-sm hover:bg-gray-200 transition"
                      >
                        <GiThunderBlade className="w-4 h-4" /> GitHub
                      </a>
                    )}
                    {selectedApp.student.studentProfile?.portfolioUrl && (
                      <a
                        href={selectedApp.student.studentProfile.portfolioUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-3 py-2 bg-purple-50 rounded-lg text-purple-600 text-sm hover:bg-purple-100 transition"
                      >
                        <Globe className="w-4 h-4" /> Portfolio
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Bio */}
              {selectedApp.student.studentProfile?.bio && (
                <div className="space-y-2">
                  <h4 className="font-bold text-[#272d68] flex items-center gap-2 text-sm uppercase tracking-wider">
                    <User className="w-4 h-4 text-[#08a4a3]" /> About
                  </h4>
                  <p className="text-sm text-[#272d68]/70 leading-relaxed bg-gray-50 p-4 rounded-xl">
                    {selectedApp.student.studentProfile.bio}
                  </p>
                </div>
              )}

              {/* Skills */}
              {selectedApp.student.studentProfile?.skills &&
                selectedApp.student.studentProfile.skills.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-[#272d68] flex items-center gap-2 text-sm uppercase tracking-wider">
                      <Code className="w-4 h-4 text-[#08a4a3]" /> Skills &
                      Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedApp.student.studentProfile.skills.map(
                        (skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1.5 bg-linear-to-r from-[#ceeeed]/40 to-[#08a4a3]/10 rounded-lg text-sm font-medium text-[#272d68] border border-[#08a4a3]/20"
                          >
                            {skill}
                          </span>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Work Experience */}
              {selectedApp.student.studentProfile?.experience &&
                selectedApp.student.studentProfile.experience.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-[#272d68] flex items-center gap-2 text-sm uppercase tracking-wider">
                      <Briefcase className="w-4 h-4 text-[#08a4a3]" /> Work
                      Experience
                    </h4>
                    <div className="space-y-3">
                      {selectedApp.student.studentProfile.experience.map(
                        (exp, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                            <div className="flex flex-wrap justify-between items-start gap-2">
                              <div>
                                <p className="font-bold text-[#272d68]">
                                  {exp.position}
                                </p>
                                <p className="text-sm text-[#08a4a3] font-medium">
                                  {exp.company}
                                </p>
                              </div>
                              <p className="text-xs text-[#272d68]/50">
                                {formatDate(exp.startDate)} -{" "}
                                {exp.endDate
                                  ? formatDate(exp.endDate)
                                  : "Present"}
                              </p>
                            </div>
                            {exp.description && (
                              <p className="text-sm text-[#272d68]/70 mt-2 leading-relaxed">
                                {exp.description}
                              </p>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Education */}
              {selectedApp.student.studentProfile?.education &&
                selectedApp.student.studentProfile.education.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-[#272d68] flex items-center gap-2 text-sm uppercase tracking-wider">
                      <GraduationCap className="w-4 h-4 text-[#08a4a3]" />{" "}
                      Education
                    </h4>
                    <div className="space-y-3">
                      {selectedApp.student.studentProfile.education.map(
                        (edu, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                            <p className="font-bold text-[#272d68]">
                              {edu.institution}
                            </p>
                            <p className="text-sm text-[#272d68]/70">
                              {edu.degree}{" "}
                              {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}
                            </p>
                            <p className="text-xs text-[#272d68]/50 mt-1">
                              {formatYear(edu.startYear)} -{" "}
                              {edu.endYear
                                ? formatYear(edu.endYear)
                                : "Present"}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Certifications */}
              {selectedApp.student.studentProfile?.certifications &&
                selectedApp.student.studentProfile.certifications.length >
                  0 && (
                  <div className="space-y-3">
                    <h4 className="font-bold text-[#272d68] flex items-center gap-2 text-sm uppercase tracking-wider">
                      <Award className="w-4 h-4 text-[#08a4a3]" />{" "}
                      Certifications
                    </h4>
                    <div className="space-y-3">
                      {selectedApp.student.studentProfile.certifications.map(
                        (cert, idx) => (
                          <div key={idx} className="p-4 bg-gray-50 rounded-xl">
                            <p className="font-bold text-[#272d68]">
                              {cert.certificationName}
                            </p>
                            {cert.organization && (
                              <p className="text-sm text-[#08a4a3] font-medium mt-1">
                                {cert.organization}
                              </p>
                            )}
                            {cert.mode && (
                              <p className="text-xs text-[#272d68]/50 mt-1">
                                Mode: {cert.mode}
                              </p>
                            )}
                            {cert.description && (
                              <p className="text-sm text-[#272d68]/70 mt-2 leading-relaxed">
                                {cert.description}
                              </p>
                            )}
                            {(cert.issueDate || cert.expirationDate) && (
                              <p className="text-xs text-[#272d68]/50 mt-2">
                                {cert.issueDate &&
                                  `Issued: ${formatYear(cert.issueDate)}`}
                                {cert.issueDate && cert.expirationDate && " • "}
                                {cert.expirationDate &&
                                  `Expires: ${formatYear(cert.expirationDate)}`}
                              </p>
                            )}
                            {cert.certificationLink && (
                              <p className="text-sm mt-2">
                                <a
                                  href={cert.certificationLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-[#08a4a3] hover:underline flex items-center gap-1"
                                >
                                  View Certificate →
                                </a>
                              </p>
                            )}
                          </div>
                        ),
                      )}
                    </div>
                  </div>
                )}

              {/* Application Details */}
              <div className="space-y-3">
                <h4 className="font-bold text-[#272d68] flex items-center gap-2 text-sm uppercase tracking-wider">
                  <FileTextIcon className="w-4 h-4 text-[#08a4a3]" />{" "}
                  Application Details
                </h4>
                <div className="p-4 bg-linear-to-r from-[#ceeeed]/20 to-white rounded-xl border border-[#08a4a3]/20">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-[#272d68]/50">Position Applied</p>
                      <p className="font-semibold text-[#272d68]">
                        {selectedApp.job.title}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#272d68]/50">Applied On</p>
                      <p className="font-semibold text-[#272d68]">
                        {formatDate(selectedApp.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#272d68]/50">Job Location</p>
                      <p className="font-semibold text-[#272d68]">
                        {selectedApp.job.location || "Remote"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#272d68]/50">Work Mode</p>
                      <p className="font-semibold text-[#272d68]">
                        {selectedApp.job.workMode || "On-site"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[#272d68]/50">Job Type</p>
                      <p className="font-semibold text-[#272d68]">
                        {selectedApp.job.jobType?.replace("_", " ") ||
                          "Full Time"}
                      </p>
                    </div>
                    {selectedApp.updatedAt &&
                      selectedApp.updatedAt !== selectedApp.createdAt && (
                        <div>
                          <p className="text-[#272d68]/50">Last Updated</p>
                          <p className="font-semibold text-[#272d68]">
                            {formatDate(selectedApp.updatedAt)}
                          </p>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Status Update Section */}
              <div className="space-y-3 pt-4 border-t border-[#272d68]/10">
                <h4 className="font-bold text-[#272d68] flex items-center gap-2 text-sm uppercase tracking-wider">
                  <Award className="w-4 h-4 text-[#08a4a3]" /> Update Status
                </h4>
                <select
                  value={selectedApp.status}
                  onChange={(e) => updateStatus(selectedApp.id, e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#272d68]/10 bg-white text-[#272d68] font-semibold focus:outline-none focus:ring-2 focus:ring-[#08a4a3]/20"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resume Download */}
              {selectedApp.student.studentProfile?.resumeUrl && (
                <div className="pt-2">
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}${selectedApp.student.studentProfile.resumeUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-linear-to-r from-[#272d68] to-[#08a4a3] text-white font-semibold hover:shadow-lg transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download Resume
                  </a>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
