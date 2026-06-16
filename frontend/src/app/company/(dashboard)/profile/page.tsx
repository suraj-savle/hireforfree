"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { apiFetch } from "@/lib/api";
import {
  FiBriefcase,
  FiPhone,
  FiGlobe,
  FiFileText,
  FiLinkedin,
  FiTwitter,
  FiFacebook,
  FiInstagram,
  FiSave,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
  FiUpload,
  FiCamera,
  FiEye,
  FiX,
  FiInfo,
} from "react-icons/fi";

export default function EditCompanyProfilePage() {
  const router = useRouter();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // File upload states
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  const docInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [form, setForm] = useState({
    companyName: "",
    description: "",
    industry: "",
    companySize: "SMALL", // Matches typical Enum defaults
    foundedAt: new Date().getFullYear(),
    ownerName: "",
    phone: "",
    address: "",
    website: "",
    linkedin: "",
    twitter: "",
    facebook: "",
    instagram: "",
    logoUrl: "",
    verificationDoc: "",
  });

  // Read-only status fields from backend
  const [statusInfo, setStatusInfo] = useState({
    approvalStatus: "PENDING",
    rejectionReason: "",
  });

  // Fetch company profile
  useEffect(() => {
    const loadCompanyData = async () => {
      try {
        interface CompanyProfile {
          companyName: string;
          description: string;
          industry: string;
          companySize: string;
          foundedAt: number | null;
          ownerName: string;
          phone: string;
          address: string;
          website: string;
          linkedin: string;
          twitter: string;
          facebook: string;
          instagram: string;
          logoUrl: string;
          verificationDoc: string;
          approvalStatus: string;
          rejectionReason: string;
        }
        const data = (await apiFetch("/profiles/company/me")) as CompanyProfile;

        if (data) {
          setForm({
            companyName: data.companyName || "",
            description: data.description || "",
            industry: data.industry || "",
            companySize: data.companySize || "",
            foundedAt: data.foundedAt || new Date().getFullYear(),
            ownerName: data.ownerName || "",
            phone: data.phone || "",
            address: data.address || "",
            website: data.website || "",
            linkedin: data.linkedin || "",
            twitter: data.twitter || "",
            facebook: data.facebook || "",
            instagram: data.instagram || "",
            logoUrl: data.logoUrl || "",
            verificationDoc: data.verificationDoc || "",
          });

          setStatusInfo({
            approvalStatus: data.approvalStatus || "PENDING",
            rejectionReason: data.rejectionReason || "",
          });
        }
      } catch (err) {
        console.error("Profile loading error:", err);
        setError("Could not load your company profile data. Please try again.");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadCompanyData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // File upload handlers
  const handleLogoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingLogo(true);
      const response = await apiFetch<{ url: string }>(
        "/uploads/company-logo",
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.url) {
        setForm((prev) => ({ ...prev, logoUrl: response.url }));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to upload company logo";
      setError(message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleDocUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingDoc(true);
      const response = await apiFetch<{ url: string }>(
        "/uploads/verification-doc",
        {
          method: "POST",
          body: formData,
        },
      );

      if (response.url) {
        setForm((prev) => ({ ...prev, verificationDoc: response.url }));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to upload verification document";
      setError(message);
      setTimeout(() => setError(null), 3000);
    } finally {
      setUploadingDoc(false);
    }
  };

  const onLogoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Logo size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      handleLogoUpload(file);
    }
  };

  const onDocSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 15 * 1024 * 1024) {
        setError("Document size should be less than 15MB");
        return;
      }
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload a PDF, JPG, or PNG file");
        return;
      }
      handleDocUpload(file);
    }
  };

  // Get fallback initials for brand logo
  const getInitials = () => {
    return form.companyName
      ? form.companyName.substring(0, 2).toUpperCase()
      : "CO";
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      foundedAt: form.foundedAt ? Number(form.foundedAt) : null,
    };

    try {
      await apiFetch("/profiles/company/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/company/profile");
      }, 1300);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";

      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <FiLoader className="h-8 w-8 animate-spin text-blue-500" />
        <span className="text-sm font-medium text-gray-600">
          Loading company profile...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl space-y-6 py-8 px-4 sm:px-6">
        {/* Header */}
        <div className="border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            Edit Company Profile
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Update your corporate presentation, verification info, and details
          </p>
        </div>

        {/* Verification Status Banner */}
        {statusInfo.approvalStatus === "REJECTED" && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 text-sm">
            <div className="flex items-start gap-3">
              <FiAlertCircle className="h-5 w-5 shrink-0 text-red-600 mt-0.5" />
              <div>
                <p className="font-semibold">Profile verification failed</p>
                <p className="mt-1 text-red-700">
                  Reason:{" "}
                  {statusInfo.rejectionReason ||
                    "No details provided. Please review documentation."}
                </p>
              </div>
            </div>
          </div>
        )}

        {statusInfo.approvalStatus === "APPROVED" && (
          <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 text-sm font-medium">
            <FiCheckCircle className="h-5 w-5 shrink-0 text-green-600" />
            <span>Your company profile is verified and active.</span>
          </div>
        )}

        {/* Notifications */}
        {error && (
          <div className="absolute right-15 top-20 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
            <FiAlertCircle className="h-5 w-5 shrink-0" />
            <span>{error}</span>
            <button onClick={() => setError(null)} className="ml-auto">
              <FiX className="h-4 w-4" />
            </button>
          </div>
        )}

        {success && (
          <div className="absolute right-15 top-20 flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700 text-sm">
            <FiCheckCircle className="h-5 w-5 shrink-0" />
            <span>Profile updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Company Brand Logo */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiCamera className="text-blue-500" /> Company Logo
            </h3>
            <div className="flex items-center gap-6">
              <div className="relative">
                {form.logoUrl ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${form.logoUrl}`}
                    alt="Company Logo"
                    width={96}
                    height={96}
                    unoptimized
                    className="w-24 h-24 rounded-lg object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-lg bg-linear-to-br from-gray-700 to-slate-900 flex items-center justify-center border-2 border-gray-200">
                    <span className="text-3xl font-bold text-white">
                      {getInitials()}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => logoInputRef.current?.click()}
                  className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 border border-gray-200 shadow-sm hover:bg-gray-50 transition"
                  disabled={uploadingLogo}
                >
                  {uploadingLogo ? (
                    <FiLoader className="h-4 w-4 animate-spin text-blue-500" />
                  ) : (
                    <FiCamera className="h-4 w-4 text-gray-600" />
                  )}
                </button>
                <input
                  ref={logoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onLogoSelect}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Upload corporate logo image
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Primary Profile Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiBriefcase className="text-blue-500" /> Core Corporate Identity
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Company Name *
                </label>
                <input
                  required
                  name="companyName"
                  value={form.companyName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-[#272d68] focus:outline-none focus:ring-1 focus:ring-[#272d68]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Owner / CEO Name
                </label>
                <input
                  name="ownerName"
                  value={form.ownerName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-[#272d68] focus:outline-none focus:ring-1 focus:ring-[#272d68]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Industry Sector
                </label>
                <input
                  name="industry"
                  value={form.industry}
                  onChange={handleChange}
                  placeholder="e.g., SaaS, Fintech, Healthcare"
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-[#272d68] focus:outline-none focus:ring-1 focus:ring-[#272d68]"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Size
                  </label>
                  <select
                    name="companySize"
                    value={form.companySize}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-[#272d68] focus:outline-none focus:ring-1 focus:ring-[#272d68]"
                  >
                    <option value="">Select Size</option>
                    <option value="SIZE_1_10">1 - 10 Employees</option>
                    <option value="SIZE_11_50">11 - 50 Employees</option>
                    <option value="SIZE_51_200">51 - 200 Employees</option>
                    <option value="SIZE_201_500">201 - 500 Employees</option>
                    <option value="SIZE_500_PLUS">500+ Employees</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Year Founded
                  </label>
                  <input
                    type="number"
                    name="foundedAt"
                    value={form.foundedAt}
                    onChange={handleChange}
                    placeholder="e.g., 2022"
                    className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-[#272d68] focus:outline-none focus:ring-1 focus:ring-[#272d68]"
                  />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  About / Business Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Provide an overview of your company's mission, workspace, and core services..."
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-[#272d68] focus:outline-none focus:ring-1 focus:ring-[#272d68]"
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiPhone className="text-blue-500" /> Contact Details & Location
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Corporate Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-[#272d68] focus:outline-none focus:ring-1 focus:ring-[#272d68]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Headquarters Address
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Suite Number, Street, City, Country"
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-[#272d68] focus:outline-none focus:ring-1 focus:ring-[#272d68]"
                />
              </div>
            </div>
          </div>

          {/* Company Verification Document */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
              <FiFileText className="text-[#272d68]/50" /> Verification Document
            </h3>
            <p className="text-xs text-gray-500 mb-4 flex items-center gap-1.5">
              <FiInfo className="text-gray-400 shrink-0" /> Upload registration
              paperwork or verification documents to unlock platform
              authorization.
            </p>
            <div className="space-y-4">
              {form.verificationDoc ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FiFileText className="h-8 w-8 text-[#272d68]" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Current Proof Document
                      </p>
                      <p className="text-xs text-gray-500">
                        {form.verificationDoc.split("/").pop()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL}${form.verificationDoc}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-blue-600 transition"
                    >
                      <FiEye className="h-5 w-5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => docInputRef.current?.click()}
                      className="p-2 text-gray-600 hover:text-blue-600 transition"
                    >
                      <FiUpload className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => docInputRef.current?.click()}
                  className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition text-center"
                  disabled={uploadingDoc}
                >
                  {uploadingDoc ? (
                    <div className="flex items-center justify-center gap-2">
                      <FiLoader className="h-5 w-5 animate-spin text-blue-500" />
                      <span className="text-sm text-gray-600">
                        Uploading verification file...
                      </span>
                    </div>
                  ) : (
                    <>
                      <FiUpload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload brand authorization/registration file
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PDF, JPG, or PNG (Max 15MB)
                      </p>
                    </>
                  )}
                </button>
              )}
              <input
                ref={docInputRef}
                type="file"
                accept=".pdf,image/jpeg,image/png"
                onChange={onDocSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Social Profiles & Web links */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiGlobe className="text-blue-500" /> Online Presence & Channels
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiGlobe className="text-gray-500 h-5 w-5" />
                <input
                  name="website"
                  placeholder="Official Website URL"
                  value={form.website}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiLinkedin className="text-blue-600 h-5 w-5" />
                <input
                  name="linkedin"
                  placeholder="LinkedIn Company Profile URL"
                  value={form.linkedin}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiTwitter className="text-sky-500 h-5 w-5" />
                <input
                  name="twitter"
                  placeholder="Twitter / X Profile URL"
                  value={form.twitter}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiFacebook className="text-[#272d68] h-5 w-5" />
                <input
                  name="facebook"
                  placeholder="Facebook Page URL"
                  value={form.facebook}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiInstagram className="text-pink-600 h-5 w-5" />
                <input
                  name="instagram"
                  placeholder="Instagram Handler URL"
                  value={form.instagram}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || success}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#272d68] text-white rounded-lg hover:bg-[#08A4A3] disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {saving ? (
                <FiLoader className="h-4 w-4 animate-spin" />
              ) : (
                <FiSave />
              )}
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
