"use client";

import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import Image from "next/image";
import {
  Building2,
  Search,
  Filter,
  ExternalLink,
  CheckCircle2,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  FileText,
  Phone,
  MapPin,
  User,
  Calendar,
  Globe,
  X,
  ShieldCheck,
  Ban,
} from "lucide-react";
import { LiaLinkedin } from "react-icons/lia";
import { BsInstagram, BsTwitter } from "react-icons/bs";
import { FaFacebook } from "react-icons/fa";

// 1. EXTRACTED SUB-COMPONENT: Restructured outside the main component tree
const StatusBadge = ({
  status,
  reason,
}: {
  status: string;
  reason?: string;
}) => {
  const config = {
    APPROVED: {
      text: "Approved",
      style: "bg-emerald-50 text-emerald-700 border-emerald-200",
      icon: <CheckCircle2 className="h-3.5 w-3.5" />,
    },
    PENDING: {
      text: "Pending Review",
      style: "bg-amber-50 text-amber-700 border-amber-200",
      icon: <Clock className="h-3.5 w-3.5" />,
    },
    REJECTED: {
      text: "Rejected",
      style: "bg-rose-50 text-rose-700 border-rose-200",
      icon: <XCircle className="h-3.5 w-3.5" />,
    },
  };

  const current = config[status as keyof typeof config] || config.PENDING;

  return (
    <div className="space-y-1 text-left">
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${current.style}`}
      >
        {current.icon}
        {current.text}
      </span>
      {status === "REJECTED" && reason && (
        <p
          className="text-[11px] text-rose-600 max-w-[160px] truncate"
          title={reason}
        >
          {reason}
        </p>
      )}
    </div>
  );
};

interface Company {
  id: string;
  companyName?: string;
  industry?: string;
  ownerName?: string;
  approvalStatus: "APPROVED" | "PENDING" | "REJECTED";
  rejectionReason?: string;
  logoUrl?: string;
  verificationDoc?: string;
  companySize?: string;
  foundedAt?: number;
  address?: string;
  description?: string;
  phone?: string;
  website?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  instagram?: string;
  createdAt?: string;
  updatedAt?: string;
  user?: {
    email?: string;
  };
}

export default function AllCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Search, Filter, Drawer & Action Processing State Management
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        setError(null);
        const data = await apiFetch("/admin/companies");
        setCompanies(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error retrieving company listings:", err);
        setError("Failed to synchronize corporate accounts database.");
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  const filteredCompanies = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch =
        company.companyName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        statusFilter === "ALL" || company.approvalStatus === statusFilter;

      return matchesSearch && matchesFilter;
    });
  }, [companies, searchTerm, statusFilter]);

  // Handle active administrative rejection
  const handleRejectCompany = async (id: string) => {
    const reason = prompt(
      "Enter the reason for profile rejection / moderation enforcement:",
    );
    if (reason === null) return;
    if (!reason.trim()) {
      alert(
        "A valid rejection reason is required to process this state update.",
      );
      return;
    }

    setProcessingId(id);
    try {
      await apiFetch(`/admin/companies/${id}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ reason }),
      });

      // Dynamic local state adjustment sync
      setCompanies((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, approvalStatus: "REJECTED", rejectionReason: reason }
            : c,
        ),
      );

      // Synchronize currently opened sidebar profile context if open
      if (selectedCompany?.id === id) {
        setSelectedCompany((prev) =>
          prev
            ? {
                ...prev,
                approvalStatus: "REJECTED",
                rejectionReason: reason,
              }
            : null,
        );
      }
    } catch (err) {
      console.error(err);
      alert("Failed to successfully register account rejection.");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 relative min-h-screen">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Corporate Accounts Directory
        </h1>
        <p className="text-zinc-500 text-sm mt-1">
          Audit profile registries, access legal verification documents, and
          monitor platform onboarding statuses.
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Search Bar / Filter Systems */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
        <div className="relative w-full sm:max-w-md">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            placeholder="Search by company, industry, owner, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-10 pr-4 py-2 text-sm text-zinc-900 placeholder-zinc-400 focus:border-zinc-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <Filter className="h-4 w-4 text-zinc-400 hidden sm:block" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-48 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-700 focus:outline-none focus:ring-1 focus:ring-zinc-400 transition"
          >
            <option value="ALL">All Verification Statuses</option>
            <option value="APPROVED">Approved Only</option>
            <option value="PENDING">Pending Action</option>
            <option value="REJECTED">Flagged / Rejected</option>
          </select>
        </div>
      </div>

      {/* Main Grid View Table Container */}
      {loading ? (
        <div className="flex h-64 w-full items-center justify-center rounded-xl border bg-white shadow-sm">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 bg-white p-16 text-center shadow-sm">
          <Building2 className="h-10 w-10 text-zinc-300 mb-3" />
          <p className="text-sm font-medium text-zinc-600">
            No matching companies located
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Try modifying your text criteria search filters or status tags.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-sm text-zinc-600">
              <thead className="bg-zinc-50 text-xs font-semibold uppercase tracking-wider text-zinc-500 border-b border-zinc-200">
                <tr>
                  <th scope="col" className="px-6 py-4">
                    Company Profile
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Verification Doc
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Onboarding Owner
                  </th>
                  <th scope="col" className="px-6 py-4">
                    Status Check
                  </th>
                  <th scope="col" className="px-6 py-4 text-right">
                    Review Tools
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 bg-white">
                {filteredCompanies.map((company) => (
                  <tr
                    key={company.id}
                    className="hover:bg-zinc-50/80 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {company.logoUrl ? (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}${company.logoUrl}`}
                            alt=""
                            width={40}
                            height={40}
                            unoptimized
                            className="h-10 w-10 shrink-0 rounded-lg object-cover border border-zinc-200 bg-zinc-50"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-500">
                            <Building2 className="h-5 w-5" />
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-zinc-900">
                            {company.companyName || "Incomplete Profile Setup"}
                          </div>
                          <div className="text-xs text-zinc-400 flex items-center gap-1.5 mt-0.5">
                            <span>
                              {company.industry || "No Industry Listed"}
                            </span>
                            {company.companySize && (
                              <>
                                <span className="inline-block w-1 h-1 rounded-full bg-zinc-300" />
                                <span>
                                  {company.companySize
                                    .replace("SIZE_", "")
                                    .replace("_", "-")}{" "}
                                  Employees
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      {company.verificationDoc ? (
                        <a
                          href={`${process.env.NEXT_PUBLIC_API_URL}${company.verificationDoc}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-zinc-700 bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 rounded-md px-2.5 py-1.5 transition font-medium"
                        >
                          <FileText className="h-3.5 w-3.5 text-red-500" />
                          <span className="max-w-[110px] truncate">View </span>
                        </a>
                      ) : (
                        <span className="text-xs text-zinc-400 italic">
                          Unattached
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      <div className="text-zinc-900 font-medium text-xs max-w-[180px] truncate">
                        {company.ownerName || "Unknown Contact"}
                      </div>
                      <div className="text-[11px] text-zinc-400 font-mono mt-0.5 max-w-[180px] truncate">
                        {company.user?.email || "N/A"}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <StatusBadge
                        status={company.approvalStatus}
                        reason={company.rejectionReason}
                      />
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedCompany(company)}
                        className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 bg-white px-3 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-50 shadow-sm transition"
                      >
                        <span>Quick View</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-zinc-50 border-t border-zinc-200 px-6 py-3 text-xs font-medium text-zinc-400">
            Showing {filteredCompanies.length} of {companies.length} entries
            located
          </div>
        </div>
      )}

      {/* COMPREHENSIVE AUDIT DETAILS SLIDE-OUT PANEL */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex justify-end bg-zinc-900/40 backdrop-blur-sm transition-opacity">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedCompany(null)}
          />

          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col z-10 border-l border-zinc-200 animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-200 bg-zinc-50">
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="h-5 w-5 text-zinc-600" />
                <h2 className="text-lg font-bold text-zinc-900">
                  Corporate System Audit
                </h2>
              </div>
              <button
                onClick={() => setSelectedCompany(null)}
                className="p-1.5 rounded-md text-zinc-400 hover:bg-zinc-200/60 hover:text-zinc-700 transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Main Information Scroll Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Branding Overview Segment */}
              <div className="flex items-start gap-4 p-4 rounded-xl bg-zinc-50 border border-zinc-100">
                {selectedCompany.logoUrl ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${selectedCompany.logoUrl}`}
                    alt=""
                    width={64}
                    height={64}
                    unoptimized
                    className="h-16 w-16 rounded-xl object-cover border border-zinc-200 bg-white shrink-0"
                  />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-white border border-zinc-200 text-zinc-400">
                    <Building2 className="h-8 w-8" />
                  </div>
                )}
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-zinc-900">
                    {selectedCompany.companyName}
                  </h3>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    {selectedCompany.industry || "No Industry Specified"}
                  </p>
                  <p className="text-xs text-zinc-400">
                    Database Entry Index:{" "}
                    <span className="font-mono text-[11px] text-zinc-600 bg-zinc-200/50 px-1 py-0.5 rounded">
                      {selectedCompany.id}
                    </span>
                  </p>
                </div>
              </div>

              {/* Grid Block 1: Profile Specifications */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Company Profile Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border border-zinc-100 bg-white shadow-xs space-y-1">
                    <span className="text-[11px] text-zinc-400 block font-medium">
                      Description
                    </span>
                    <span className="text-xs text-zinc-800 font-medium block leading-relaxed">
                      {selectedCompany.description ||
                        "No core summary documentation written."}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-zinc-100 bg-white shadow-xs space-y-1">
                    <span className="text-[11px] text-zinc-400 block font-medium">
                      Staff Scale & Size
                    </span>
                    <span className="text-xs text-zinc-800 font-medium block">
                      {selectedCompany.companySize
                        ? selectedCompany.companySize
                            .replace("SIZE_", "")
                            .replace("_", "-") + " Employees"
                        : "Not Provided"}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-zinc-100 bg-white shadow-xs space-y-1">
                    <span className="text-[11px] text-zinc-400 block font-medium">
                      Foundation Year
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-800 font-medium">
                      <Calendar className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{selectedCompany.foundedAt || "Unspecified"}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-zinc-100 bg-white shadow-xs space-y-1">
                    <span className="text-[11px] text-zinc-400 block font-medium">
                      Registered Corporate Address
                    </span>
                    <div className="flex items-start gap-1.5 text-xs text-zinc-800 font-medium">
                      <MapPin className="h-3.5 w-3.5 text-zinc-400 shrink-0 mt-0.5" />
                      <span>
                        {selectedCompany.address ||
                          "No Physical Location Setup"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Grid Block 2: Onboarding Stakeholder Data */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Stakeholder & Communication Data
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg border border-zinc-100 bg-white shadow-xs space-y-1">
                    <span className="text-[11px] text-zinc-400 block font-medium">
                      Owner Name Reference
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-800 font-medium">
                      <User className="h-3.5 w-3.5 text-zinc-400" />
                      <span>{selectedCompany.ownerName || "N/A"}</span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-zinc-100 bg-white shadow-xs space-y-1">
                    <span className="text-[11px] text-zinc-400 block font-medium">
                      Onboarding System Email
                    </span>
                    <span className="text-xs text-zinc-800 font-mono font-medium block select-all">
                      {selectedCompany.user?.email || "N/A"}
                    </span>
                  </div>
                  <div className="p-3 rounded-lg border border-zinc-100 bg-white shadow-xs space-y-1">
                    <span className="text-[11px] text-zinc-400 block font-medium">
                      Direct Telephone
                    </span>
                    <div className="flex items-center gap-1.5 text-xs text-zinc-800 font-medium">
                      <Phone className="h-3.5 w-3.5 text-zinc-400" />
                      <span className="select-all">
                        {selectedCompany.phone ||
                          "No communication channel connected"}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 rounded-lg border border-zinc-100 bg-white shadow-xs space-y-1">
                    <span className="text-[11px] text-zinc-400 block font-medium">
                      System Records History
                    </span>
                    <div className="text-[10px] space-y-0.5 text-zinc-500 font-medium">
                      <p>
                        Created:{" "}
                        {selectedCompany.createdAt
                          ? new Date(selectedCompany.createdAt).toLocaleString()
                          : "N/A"}
                      </p>
                      <p>
                        Updated:{" "}
                        {selectedCompany.updatedAt
                          ? new Date(selectedCompany.updatedAt).toLocaleString()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 3: Legal Verification Documentation Inspection Desk */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Corporate Verification Assets
                </h4>
                <div className="p-4 rounded-xl border border-zinc-200 bg-white shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-red-500" />
                      <span className="text-xs font-bold text-zinc-800">
                        Verification Document Upload
                      </span>
                    </div>
                    {selectedCompany.verificationDoc && (
                      <a
                        href={`${process.env.NEXT_PUBLIC_API_URL}${selectedCompany.verificationDoc}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-600 hover:underline"
                      >
                        <span>Open Document Tab</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  {selectedCompany.verificationDoc ? (
                    <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3 flex flex-col items-center justify-center text-center">
                      <p className="text-xs font-mono text-zinc-600 break-all max-w-full bg-white px-2 py-1 rounded border border-zinc-200 mb-2">
                        {selectedCompany.verificationDoc}
                      </p>
                      <p className="text-[11px] text-zinc-400">
                        Uploaded for operational licensing and corporate
                        identity verification assessments.
                      </p>
                    </div>
                  ) : (
                    <div className="p-6 rounded-lg border border-dashed border-zinc-200 bg-zinc-50 text-center text-xs text-zinc-400 italic">
                      No corporate identification papers attached to this
                      business profile registry.
                    </div>
                  )}
                </div>
              </div>

              {/* Section 4: Public Links & Branding Networks */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Public Channels & Social Handles
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <a
                    href={selectedCompany.website || undefined}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2 p-2.5 rounded-lg border border-zinc-100 bg-white text-xs font-medium transition ${selectedCompany.website ? "text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300" : "text-zinc-300 pointer-events-none"}`}
                  >
                    <Globe className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span className="truncate">Website</span>
                  </a>
                  <a
                    href={selectedCompany.linkedin || undefined}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2 p-2.5 rounded-lg border border-zinc-100 bg-white text-xs font-medium transition ${selectedCompany.linkedin ? "text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300" : "text-zinc-300 pointer-events-none"}`}
                  >
                    <LiaLinkedin className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span className="truncate">LinkedIn</span>
                  </a>
                  <a
                    href={selectedCompany.twitter || undefined}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2 p-2.5 rounded-lg border border-zinc-100 bg-white text-xs font-medium transition ${selectedCompany.twitter ? "text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300" : "text-zinc-300 pointer-events-none"}`}
                  >
                    <BsTwitter className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span className="truncate">Twitter</span>
                  </a>
                  <a
                    href={selectedCompany.facebook || undefined}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2 p-2.5 rounded-lg border border-zinc-100 bg-white text-xs font-medium transition ${selectedCompany.facebook ? "text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300" : "text-zinc-300 pointer-events-none"}`}
                  >
                    <FaFacebook className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span className="truncate">Facebook</span>
                  </a>
                  <a
                    href={selectedCompany.instagram || undefined}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-2 p-2.5 rounded-lg border border-zinc-100 bg-white text-xs font-medium transition ${selectedCompany.instagram ? "text-zinc-800 hover:bg-zinc-50 hover:border-zinc-300" : "text-zinc-300 pointer-events-none"}`}
                  >
                    <BsInstagram className="h-4 w-4 text-zinc-400 shrink-0" />
                    <span className="truncate">Instagram</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Bottom Actions Footer Layout */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex items-center justify-between px-6 gap-4">
              <div>
                <StatusBadge
                  status={selectedCompany.approvalStatus}
                  reason={selectedCompany.rejectionReason}
                />
              </div>

              {/* Show absolute controls to reject any active or pending company */}
              {selectedCompany.approvalStatus !== "REJECTED" && (
                <button
                  type="button"
                  disabled={processingId === selectedCompany.id}
                  onClick={() => handleRejectCompany(selectedCompany.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 rounded-lg transition shadow-xs shrink-0"
                >
                  {processingId === selectedCompany.id ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Ban className="h-3.5 w-3.5" />
                  )}
                  <span>Enforce Rejection</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
