"use client";

import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import Image from "next/image";
import {
  GraduationCap,
  Search,
  Trash2,
  FileText,
  Loader2,
  AlertCircle,
  MapPin,
  ExternalLink,
} from "lucide-react";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  headline?: string;
  address?: string;
  searchStatus?: "ACTIVE" | "PASSIVE" | "HIRED";
  skills?: string[];
  resumeUrl?: string;
  imageUrl?: string; // Profile image reference field
  linkedin?: string;
  github?: string;
  user?: {
    id: string;
    email: string;
  };
}

export default function AllStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");

  const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";

  useEffect(() => {
    let isActive = true;

    const fetchStudents = async () => {
      try {
        setError(null);
        const data = await apiFetch("/admin/students");

        if (!isActive) {
          return;
        }

        setStudents(Array.isArray(data) ? data : []);
      } catch (err: unknown) {
        console.error("Failed sync sequence:", err);

        if (isActive) {
          setError("Unable to map active student directory.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchStudents();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const fullName = `${student.firstName} ${student.lastName}`.toLowerCase();
      const email = student.user?.email?.toLowerCase() || "";
      const skillsMatch =
        student.skills?.some((s) =>
          s.toLowerCase().includes(searchTerm.toLowerCase()),
        ) || false;

      const matchesSearch =
        fullName.includes(searchTerm.toLowerCase()) ||
        email.includes(searchTerm.toLowerCase()) ||
        skillsMatch;

      const matchesFilter =
        statusFilter === "ALL" || student.searchStatus === statusFilter;

      return matchesSearch && matchesFilter;
    });
  }, [students, searchTerm, statusFilter]);

  const handleDelete = async (student: Student) => {
    const targetUserId = student.user?.id;

    if (!targetUserId) {
      setError("Cannot delete: Structural account tracking mapping missing.");
      return;
    }

    if (
      !window.confirm(
        `Permanently drop ${student.firstName} ${student.lastName} from platform registers?`,
      )
    ) {
      return;
    }

    try {
      setDeletingId(targetUserId);
      setError(null);

      await apiFetch(`/admin/students/${targetUserId}`, {
        method: "DELETE",
      });

      setStudents((prev) => prev.filter((s) => s.user?.id !== targetUserId));
    } catch (err: unknown) {
      console.error("Deletion rejected:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to complete account extraction command.",
      );
      void (async () => {
        try {
          const data = await apiFetch("/admin/students");
          setStudents(Array.isArray(data) ? data : []);
        } catch (refreshErr) {
          console.error("Failed to refresh students:", refreshErr);
        }
      })();
    } finally {
      setDeletingId(null);
    }
  };

  const getInitials = (first: string, last: string) => {
    return ((first?.charAt(0) || "") + (last?.charAt(0) || "")).toUpperCase();
  };

  // Safely clean and resolve URLs to avoid duplicate slashes
  const resolveAssetUrl = (path?: string) => {
    if (!path) return "";
    if (path.startsWith("http://") || path.startsWith("https://")) return path;
    const cleanBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${cleanBase}${cleanPath}`;
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-[#272d68] tracking-tight">
            Student Directory
          </h1>
          <p className="text-[#272d68]/60 text-sm font-medium mt-1">
            {loading
              ? "Syncing index..."
              : `Monitoring ${filteredStudents.length} candidate talent profiles`}
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700 text-sm font-semibold">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Control Input Cluster */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between rounded-2xl border border-[#272d68]/10 bg-white p-4 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#272d68]/40" />
          <input
            type="text"
            placeholder="Search candidate name, email, or core skill..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-[#272d68]/10 bg-gray-50/50 pl-10 pr-4 py-2.5 text-sm text-[#272d68] font-semibold placeholder-[#272d68]/40 focus:border-[#08a4a3]/40 focus:bg-white focus:outline-none transition-colors"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-52 rounded-xl border border-[#272d68]/10 bg-gray-50/50 px-3 py-2.5 text-sm text-[#272d68] font-bold focus:outline-none focus:border-[#08a4a3]/40 focus:bg-white transition-colors"
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">Active Search</option>
          <option value="PASSIVE">Passive Search</option>
          <option value="HIRED">Hired</option>
        </select>
      </div>

      {/* MAIN DATA LOOP */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-40 w-full animate-pulse rounded-2xl border border-[#272d68]/5 bg-white shadow-sm"
            />
          ))}
        </div>
      ) : filteredStudents.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#272d68]/20 bg-white p-16 text-center shadow-sm">
          <div className="rounded-xl bg-[#ceeeed] p-3 text-[#08a4a3] mb-3">
            <GraduationCap className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-[#272d68]">
            No matching students found
          </p>
          <p className="text-xs text-[#272d68]/50 mt-1">
            Adjust your keywords or status constraints criteria filter
            parameters.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="group relative flex flex-col lg:flex-row lg:items-center justify-between gap-6 rounded-2xl border border-[#272d68]/10 bg-white p-6 shadow-sm transition-all duration-300 hover:border-[#08a4a3]/30"
            >
              {/* Profile Details segment */}
              <div className="flex flex-col sm:flex-row items-start gap-4 flex-1">
                {/* Dynamically Loaded Profile Avatar Box */}
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-slate-50 border border-[#272d68]/10 overflow-hidden text-[#08a4a3] shadow-inner font-black text-sm">
                  {student.imageUrl ? (
                    <Image
                      src={resolveAssetUrl(student.imageUrl)}
                      alt={`${student.firstName}'s photo`}
                      width={56}
                      height={56}
                      unoptimized
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback image handling if file string fails on target port
                        (e.currentTarget as HTMLImageElement).style.display =
                          "none";
                        const parent = (e.currentTarget as HTMLImageElement)
                          .parentElement;
                        if (parent) {
                          const span = document.createElement("span");
                          span.innerText = getInitials(
                            student.firstName,
                            student.lastName,
                          );
                          parent.appendChild(span);
                        }
                      }}
                    />
                  ) : (
                    <span>
                      {getInitials(student.firstName, student.lastName)}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <h2 className="text-base md:text-lg font-extrabold text-[#272d68]">
                      {student.firstName} {student.lastName}
                    </h2>
                    {student.searchStatus && (
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase border ${
                          student.searchStatus === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-600 border-emerald-200"
                            : student.searchStatus === "HIRED"
                              ? "bg-blue-50 text-blue-600 border-blue-200"
                              : "bg-gray-100 text-gray-600 border-gray-200"
                        }`}
                      >
                        {student.searchStatus === "ACTIVE"
                          ? "Active Search"
                          : student.searchStatus === "HIRED"
                            ? "Hired"
                            : "Passive"}
                      </span>
                    )}

                    {/* Quick Inline Resume URL view Badge Option */}
                    {student.resumeUrl && (
                      <a
                        href={resolveAssetUrl(student.resumeUrl)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#08a4a3] bg-[#ceeeed]/30 border border-[#08a4a3]/20 px-2 py-0.5 rounded-md hover:bg-[#08a4a3] hover:text-white transition"
                      >
                        <FileText className="h-3 w-3" /> Resume{" "}
                        <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                  </div>

                  <p className="text-xs text-[#272d68]/50 font-mono font-semibold">
                    {student.user?.email || "Missing Login Reference"}
                  </p>

                  {student.headline && (
                    <p className="text-sm text-[#272d68]/80 font-medium max-w-2xl line-clamp-1">
                      {student.headline}
                    </p>
                  )}

                  {/* Geolocation metadata */}
                  {student.address && (
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 pt-0.5 text-xs font-semibold text-[#272d68]/40">
                      <span className="flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5" />
                        {student.address}
                      </span>
                    </div>
                  )}

                  {/* Skills tags list */}
                  {student.skills && student.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {student.skills.slice(0, 8).map((skill, index) => (
                        <span
                          key={index}
                          className="rounded-lg bg-gray-50 border border-gray-200/60 px-2.5 py-0.5 text-xs font-semibold text-[#272d68]/70"
                        >
                          {skill}
                        </span>
                      ))}
                      {student.skills.length > 8 && (
                        <span className="text-xs text-[#272d68]/40 self-center font-bold pl-1">
                          +{student.skills.length - 8} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Links & Controls */}
              <div className="flex flex-wrap sm:flex-nowrap items-center lg:justify-end gap-3 border-t border-gray-100 pt-4 lg:border-t-0 lg:pt-0">
                <div className="flex items-center gap-1 sm:border-r border-gray-100 sm:pr-3">
                  {student.resumeUrl && (
                    <a
                      href={resolveAssetUrl(student.resumeUrl)}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 text-[#272d68]/60 hover:text-[#08a4a3] hover:bg-[#ceeeed]/30 rounded-xl transition-all"
                      title="View Full Resume Document"
                    >
                      <FileText className="h-4 w-4" />
                    </a>
                  )}
                  {student.linkedin && (
                    <a
                      href={student.linkedin}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 text-[#272d68]/60 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                      title="LinkedIn Profile"
                    >
                      <FaLinkedin className="h-4 w-4" />
                    </a>
                  )}
                  {student.github && (
                    <a
                      href={student.github}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 text-[#272d68]/60 hover:text-black hover:bg-gray-100 rounded-xl transition-all"
                      title="GitHub Profile"
                    >
                      <FaGithub className="h-4 w-4" />
                    </a>
                  )}
                </div>

                <button
                  disabled={deletingId === student.user?.id}
                  onClick={() => handleDelete(student)}
                  className="flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50/50 hover:bg-rose-50 hover:border-rose-300 px-4 py-2.5 text-xs font-bold text-rose-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all w-full sm:w-auto shrink-0 active:scale-[0.98]"
                >
                  {deletingId === student.user?.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                  <span>Remove Candidate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
