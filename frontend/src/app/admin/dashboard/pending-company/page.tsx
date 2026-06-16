"use client";

import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "@/lib/api";
import Image from "next/image";
import {
  Check,
  X,
  FileText,
  Mail,
  Building2,
  Loader2,
  Eye,
  User,
  Globe,
  ShieldCheck,
  Clock,
  ExternalLink,
  Search,
} from "lucide-react";
import { FaLinkedin, FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import { CompaniesResponse, Company } from "@/types/company";

export default function PendingCompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let isActive = true;

    const fetchCompanies = async () => {
      try {
        setLoading(true);
        const data = await apiFetch<CompaniesResponse>(
          "/admin/companies/pending",
        );

        if (!isActive) {
          return;
        }

        setCompanies(data.companies || []);
      } catch (error) {
        console.error("Failed to fetch pending companies:", error);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchCompanies();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredCompanies = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return companies;
    }

    return companies.filter(
      (company) =>
        company.companyName?.toLowerCase().includes(term) ||
        company.user?.email?.toLowerCase().includes(term) ||
        company.industry?.toLowerCase().includes(term) ||
        company.ownerName?.toLowerCase().includes(term),
    );
  }, [companies, searchTerm]);

  const approveCompany = async (id: string) => {
    setProcessingId(id);
    try {
      await apiFetch(`/admin/companies/${id}/approve`, { method: "PATCH" });
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      setSelectedCompany(null);
    } catch (error) {
      console.error(error);
      alert("Failed to approve company.");
    } finally {
      setProcessingId(null);
    }
  };

  const rejectCompany = async (id: string) => {
    const reason = prompt("Enter the reason for profile rejection:");
    if (reason === null) return;
    if (!reason.trim()) return alert("A rejection reason is required.");

    setProcessingId(id);
    try {
      await apiFetch(`/admin/companies/${id}/reject`, {
        method: "PATCH",
        body: JSON.stringify({ reason }),
      });
      setCompanies((prev) => prev.filter((c) => c.id !== id));
      setSelectedCompany(null);
    } catch (error) {
      console.error(error);
      alert("Failed to reject company.");
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="relative">
          <div className="w-12 h-12 border-4 border-[#ceeeed] rounded-full"></div>
          <div className="absolute top-0 left-0 w-12 h-12 border-4 border-[#08a4a3] rounded-full border-t-transparent animate-spin"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#272d68]">
          Pending Verifications
        </h1>
        <p className="text-sm font-medium text-[#272d68]/60 mt-1">
          Review business document submissions and manage activation pipelines
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#272d68]/40" />
        <input
          type="text"
          placeholder="Search by company, email, or industry..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-xl border border-[#272d68]/10 bg-white pl-10 pr-4 py-2.5 text-sm text-[#272d68] placeholder:text-[#272d68]/40 focus:border-[#08a4a3] focus:outline-none focus:ring-2 focus:ring-[#08a4a3]/20 transition"
        />
      </div>

      {/* Empty State */}
      {companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#272d68]/20 bg-white p-12 text-center shadow-sm">
          <div className="rounded-xl bg-[#ceeeed] p-3 text-[#08a4a3] mb-3">
            <Building2 className="w-8 h-8" />
          </div>
          <p className="font-bold text-[#272d68] text-lg">All caught up!</p>
          <p className="text-sm text-[#272d68]/60 max-w-xs mt-1">
            No company profiles are currently waiting for admin authorization.
          </p>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#272d68]/20 bg-white p-12 text-center shadow-sm">
          <Search className="w-10 h-10 text-[#272d68]/30 mb-3" />
          <p className="font-bold text-[#272d68]">No matching companies</p>
          <p className="text-sm text-[#272d68]/60 mt-1">
            Try adjusting your search terms
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="group relative rounded-2xl border border-[#272d68]/10 bg-white p-5 md:p-6 shadow-sm transition-all duration-200 hover:shadow-md hover:border-[#08a4a3]/30"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left - Company Info */}
                <div className="flex items-start gap-4">
                  {/* Logo/Avatar */}
                  <div className="hidden sm:flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-[#ceeeed] to-[#08a4a3]/20 border border-[#08a4a3]/20 text-[#272d68]">
                    {company.logoUrl ? (
                      <Image
                        src={`${process.env.NEXT_PUBLIC_API_URL}${company.logoUrl}`}
                        alt={company.companyName}
                        width={56}
                        height={56}
                        unoptimized
                        className="w-full h-full rounded-xl object-cover"
                      />
                    ) : (
                      <Building2 className="w-6 h-6 text-[#08a4a3]" />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <h2 className="font-extrabold text-lg text-[#272d68]">
                      {company.companyName}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-medium text-[#272d68]/60">
                      <span className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-[#08a4a3]" />
                        {company.user.email}
                      </span>
                      {company.industry && (
                        <span className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-[#08a4a3]" />
                          {company.industry}
                        </span>
                      )}
                      {company.ownerName && (
                        <span className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#08a4a3]" />
                          {company.ownerName}
                        </span>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold">
                      <Clock className="w-3.5 h-3.5" />
                      Pending Review
                    </div>
                  </div>
                </div>

                {/* Right - Actions */}
                <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4 lg:border-none lg:pt-0">
                  {/* View Details Button */}
                  <button
                    onClick={() => setSelectedCompany(company)}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#272d68]/10 bg-white px-4 py-2.5 text-xs font-bold text-[#272d68] hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="w-4 h-4 text-[#08a4a3]" />
                    View Details
                  </button>

                  {/* Verification Document */}
                  {company.verificationDoc && (
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL}${company.verificationDoc}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 rounded-xl border border-[#272d68]/10 bg-gray-50 px-4 py-2.5 text-xs font-bold text-[#272d68] hover:bg-gray-100 transition-colors"
                    >
                      <FileText className="w-4 h-4 text-[#08a4a3]" />
                      View Docs
                    </a>
                  )}

                  {/* Approve Button */}
                  <button
                    disabled={processingId !== null}
                    onClick={() => approveCompany(company.id)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-sm hover:shadow-md transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    {processingId === company.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Approve
                  </button>

                  {/* Reject Button */}
                  <button
                    disabled={processingId !== null}
                    onClick={() => rejectCompany(company.id)}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100 transition-all active:scale-[0.98] disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Review Slide-out Panel */}
      {selectedCompany && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm transition-opacity">
          <div
            className="absolute inset-0"
            onClick={() => setSelectedCompany(null)}
          />

          <div className="relative w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#272d68]/10 bg-linear-to-r from-[#272d68] to-[#08a4a3]">
              <div className="flex items-center gap-3">
                <ShieldCheck className="h-5 w-5 text-white" />
                <h2 className="text-lg font-bold text-white">
                  Company Verification Review
                </h2>
              </div>
              <button
                onClick={() => setSelectedCompany(null)}
                className="p-2 rounded-lg text-white/80 hover:bg-white/10 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Company Header */}
              <div className="flex items-center gap-4 p-4 rounded-xl bg-[#ceeeed]/20 border border-[#08a4a3]/20">
                <div className="h-16 w-16 rounded-xl bg-linear-to-br from-[#272d68] to-[#08a4a3] flex items-center justify-center text-white font-bold text-xl shadow-md">
                  {selectedCompany.logoUrl ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}${selectedCompany.logoUrl}`}
                      alt={selectedCompany.companyName}
                      width={64}
                      height={64}
                      unoptimized
                      className="w-full h-full rounded-xl object-cover"
                    />
                  ) : (
                    selectedCompany.companyName?.charAt(0).toUpperCase() || "C"
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#272d68]">
                    {selectedCompany.companyName}
                  </h3>
                  <p className="text-sm text-[#08a4a3] font-medium">
                    {selectedCompany.industry || "Industry not specified"}
                  </p>
                </div>
              </div>

              {/* Basic Information */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#272d68]/60 uppercase tracking-wider">
                  Company Information
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-[#272d68]/50">Company Size</p>
                    <p className="text-sm font-semibold text-[#272d68]">
                      {selectedCompany.companySize || "Not specified"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-[#272d68]/50">Owner/Founder</p>
                    <p className="text-sm font-semibold text-[#272d68]">
                      {selectedCompany.ownerName || "Not specified"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-[#272d68]/50">Email</p>
                    <p className="text-sm font-semibold text-[#272d68]">
                      {selectedCompany.user?.email}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50">
                    <p className="text-xs text-[#272d68]/50">Phone</p>
                    <p className="text-sm font-semibold text-[#272d68]">
                      {selectedCompany.phone || "Not specified"}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-gray-50 col-span-2">
                    <p className="text-xs text-[#272d68]/50">Address</p>
                    <p className="text-sm font-semibold text-[#272d68]">
                      {selectedCompany.address || "Not specified"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Description */}
              {selectedCompany.description && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-[#272d68]/60 uppercase tracking-wider">
                    About the Company
                  </h4>
                  <p className="text-sm text-[#272d68]/70 leading-relaxed p-3 bg-gray-50 rounded-lg">
                    {selectedCompany.description}
                  </p>
                </div>
              )}

              {/* Verification Document */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-[#272d68]/60 uppercase tracking-wider">
                  Verification Document
                </h4>
                <div className="p-4 rounded-xl border border-[#08a4a3]/20 bg-[#ceeeed]/20">
                  {selectedCompany.verificationDoc ? (
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL}${selectedCompany.verificationDoc}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 bg-white rounded-lg hover:shadow-md transition"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-[#08a4a3]" />
                        <span className="text-sm font-medium text-[#272d68]">
                          View Verification Document
                        </span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-[#272d68]/50" />
                    </a>
                  ) : (
                    <p className="text-sm text-[#272d68]/50 text-center py-4">
                      No verification document uploaded
                    </p>
                  )}
                </div>
              </div>

              {/* Social Links */}
              {(selectedCompany.website ||
                selectedCompany.linkedin ||
                selectedCompany.twitter ||
                selectedCompany.facebook ||
                selectedCompany.instagram) && (
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-[#272d68]/60 uppercase tracking-wider">
                    Social & Web Presence
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedCompany.website && (
                      <a
                        href={selectedCompany.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 text-sm text-[#272d68] hover:bg-gray-100 transition"
                      >
                        <Globe className="w-4 h-4 text-[#08a4a3]" />
                        Website
                      </a>
                    )}
                    {selectedCompany.linkedin && (
                      <a
                        href={selectedCompany.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 text-sm text-[#272d68] hover:bg-gray-100 transition"
                      >
                        <FaLinkedin className="w-4 h-4 text-[#0077b5]" />
                        LinkedIn
                      </a>
                    )}
                    {selectedCompany.twitter && (
                      <a
                        href={selectedCompany.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 text-sm text-[#272d68] hover:bg-gray-100 transition"
                      >
                        <FaTwitter className="w-4 h-4 text-[#1DA1F2]" />
                        Twitter
                      </a>
                    )}
                    {selectedCompany.facebook && (
                      <a
                        href={selectedCompany.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 text-sm text-[#272d68] hover:bg-gray-100 transition"
                      >
                        <FaFacebook className="w-4 h-4 text-[#4267B2]" />
                        Facebook
                      </a>
                    )}
                    {selectedCompany.instagram && (
                      <a
                        href={selectedCompany.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 p-2.5 rounded-lg bg-gray-50 text-sm text-[#272d68] hover:bg-gray-100 transition"
                      >
                        <FaInstagram className="w-4 h-4 text-[#E4405F]" />
                        Instagram
                      </a>
                    )}
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className="space-y-2 pt-2 border-t border-[#272d68]/10">
                <p className="text-xs text-[#272d68]/50">
                  Submitted: {formatDate(selectedCompany.createdAt)}
                </p>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-[#272d68]/10 bg-gray-50 flex gap-3">
              <button
                onClick={() => approveCompany(selectedCompany.id)}
                disabled={processingId !== null}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-bold text-sm hover:shadow-md transition disabled:opacity-50"
              >
                {processingId === selectedCompany.id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Approve Company
              </button>
              <button
                onClick={() => rejectCompany(selectedCompany.id)}
                disabled={processingId !== null}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 font-bold text-sm hover:bg-rose-100 transition disabled:opacity-50"
              >
                <X className="w-4 h-4" />
                Reject Company
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add slide-in animation style */}
      <style jsx>{`
        @keyframes slide-in-from-right {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-in {
          animation: slide-in-from-right 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
