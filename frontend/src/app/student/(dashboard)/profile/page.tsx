"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import {
  FiUser,
  FiPhone,
  FiBriefcase,
  FiFileText,
  FiGithub,
  FiLinkedin,
  FiGlobe,
  FiPlus,
  FiTrash2,
  FiSave,
  FiLoader,
  FiAlertCircle,
  FiCheckCircle,
  FiUpload,
  FiCamera,
  FiEye,
  FiX,
  FiAward,
} from "react-icons/fi";

interface EducationEntry {
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startYear: number;
  endYear?: number | null;
}

interface ExperienceEntry {
  company: string;
  position: string;
  description?: string;
  startDate: string;
  endDate?: string | null;
}

interface CertificationsEntry {
  certificationName: string;
  organization: string;
  mode?: string;
  startDate?: string;
  endDate?: string | null;
  description?: string;
  certificationLink?: string;
}

interface StudentForm {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  headline: string;
  bio: string;
  searchStatus: "ACTIVE" | "PASSIVE" | "HIRED";
  resumeUrl: string;
  imageUrl: string;
  linkedin: string;
  github: string;
  portfolioUrl: string;
}

export default function EditStudentProfilePage() {
  const router = useRouter();
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // File upload states
  const [uploadingResume, setUploadingResume] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);

  // Form State
 const [form, setForm] = useState<StudentForm>({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    headline: "",
    bio: "",
    searchStatus: "ACTIVE",
    resumeUrl: "",
    imageUrl: "",
    linkedin: "",
    github: "",
    portfolioUrl: "",
 });
  
  interface UploadResponse {
  url: string;
}

  const [skills, setSkills] = useState<string[]>([]);
  const [education, setEducation] = useState<EducationEntry[]>([]);
  const [experience, setExperience] = useState<ExperienceEntry[]>([]);
  const [certifications, setCertifications] = useState<CertificationsEntry[]>(
    [],
  );

  // Sub-form input states
  const [skillInput, setSkillInput] = useState("");
  const [eduInput, setEduInput] = useState<EducationEntry>({
    institution: "",
    degree: "",
    fieldOfStudy: "",
    startYear: new Date().getFullYear(),
    endYear: null,
  });
  const [expInput, setExpInput] = useState<ExperienceEntry>({
    company: "",
    position: "",
    description: "",
    startDate: "",
    endDate: null,
  });
  const [certInput, setCertInput] = useState<CertificationsEntry>({
    certificationName: "",
    organization: "",
    mode: "",
    startDate: "",
    endDate: null,
    description: "",
    certificationLink: "",
  });

  interface StudentProfileResponse {
  firstName: string;
  lastName: string;
  phone?: string;
  address?: string;
  headline?: string;
  bio?: string;
  searchStatus?: "ACTIVE" | "PASSIVE" | "HIRED";
  resumeUrl?: string;
  imageUrl?: string;
  linkedin?: string;
  github?: string;
  portfolioUrl?: string;

  skills?: string[];
  education?: EducationEntry[];
  experience?: ExperienceEntry[];
  certifications?: CertificationsEntry[];
}

  // Fetch student profile
  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const data = await apiFetch<StudentProfileResponse>("/profiles/student/me");

        if (data) {
          setForm({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phone: data.phone || "",
            address: data.address || "",
            headline: data.headline || "",
            bio: data.bio || "",
            searchStatus: data.searchStatus || "ACTIVE",
            resumeUrl: data.resumeUrl || "",
            imageUrl: data.imageUrl || "",
            linkedin: data.linkedin || "",
            github: data.github || "",
            portfolioUrl: data.portfolioUrl || "",
          });
          setSkills(Array.isArray(data.skills) ? data.skills : []);
          setEducation(Array.isArray(data.education) ? data.education : []);
          setExperience(Array.isArray(data.experience) ? data.experience : []);
          setCertifications(
            Array.isArray(data.certifications) ? data.certifications : [],
          );
        }
      } catch (err: unknown) {
        console.error("Profile loading error:", err);
        setError("Could not load your profile data. Please try again.");
      } finally {
        setLoadingProfile(false);
      }
    };

    loadStudentData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // File upload handlers
  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingImage(true);
      const response = await apiFetch<UploadResponse>("/uploads/profile-image", {
        method: "POST",
        body: formData,
      });

      if (response.url) {
        setForm((prev) => ({ ...prev, imageUrl: response.url }));
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload profile image";

      setError(errorMessage);
      setTimeout(() => setError(null), 3000);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleResumeUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploadingResume(true);

      const response = await apiFetch<UploadResponse>("/uploads/resume", {
        method: "POST",
        body: formData,
      });

      if (response.url) {
        setForm((prev) => ({
          ...prev,
          resumeUrl: response.url,
        }));

        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to upload resume";

      setError(errorMessage);
      setTimeout(() => setError(null), 3000);

      console.error(err);
    } finally {
      setUploadingResume(false);
    }
  };

  const onImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file");
        return;
      }
      handleImageUpload(file);
    }
  };

  const onResumeSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Resume size should be less than 10MB");
        return;
      }
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        setError("Please upload PDF or DOC file");
        return;
      }
      handleResumeUpload(file);
    }
  };

  // Get initials for avatar
  const getInitials = () => {
    const first = form.firstName?.charAt(0) || "";
    const last = form.lastName?.charAt(0) || "";
    return (first + last).toUpperCase() || "?";
  };

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const addEducation = () => {
    if (eduInput.institution && eduInput.degree) {
      setEducation([
        ...education,
        {
          ...eduInput,
          startYear: Number(eduInput.startYear),
          endYear: eduInput.endYear ? Number(eduInput.endYear) : null,
        },
      ]);
      setEduInput({
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startYear: new Date().getFullYear(),
        endYear: null,
      });
    }
  };

  const addExperience = () => {
    if (expInput.company && expInput.position) {
      setExperience([...experience, expInput]);
      setExpInput({
        company: "",
        position: "",
        description: "",
        startDate: "",
        endDate: null,
      });
    }
  };

  const addCertification = () => {
    if (certInput.certificationName && certInput.organization) {
      setCertifications([...certifications, certInput]);
      setCertInput({
        certificationName: "",
        organization: "",
        mode: "",
        startDate: "",
        endDate: null,
        description: "",
        certificationLink: "",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      ...form,
      skills,
      education,
      experience,
      certifications,
    };

    try {
      await apiFetch("/profiles/student/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/student/profile");
      }, 1300);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to update profile";

      console.error(message);
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center gap-3">
        <FiLoader className="h-8 w-8 animate-spin text-[#272d68]/50" />
        <span className="text-sm font-medium text-gray-600">
          Loading your profile...
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
            Edit Profile
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Update your professional information and documents
          </p>
        </div>

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
          {/* Profile Image Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiCamera className="text-[#272d68]/50" /> Profile Picture
            </h3>
            <div className="flex items-center gap-6">
              <div className="relative">
                {form.imageUrl ? (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_API_URL}${form.imageUrl}`}
                    alt="Profile"
                    width={96}
                    height={96}
                    unoptimized
                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-linear-to-br from-blue-500 to-purple-600 flex items-center justify-center border-2 border-gray-200">
                    <span className="text-3xl font-bold text-white">
                      {getInitials()}
                    </span>
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-white rounded-full p-1.5 border border-gray-200 shadow-sm hover:bg-gray-50 transition"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? (
                    <FiLoader className="h-4 w-4 animate-spin text-[#272d68]/50" />
                  ) : (
                    <FiCamera className="h-4 w-4 text-gray-600" />
                  )}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={onImageSelect}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <p className="text-sm text-gray-600">
                  Upload a profile picture
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
          </div>

          {/* Identity Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiUser className="text-primary" /> Basic Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  required
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:text-primary focus:outline-none focus:ring-1 focus:ring-[#272d68]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  required
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-[#272d68] focus:outline-none focus:ring-1 focus:ring-[#272d68]"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Headline
                </label>
                <input
                  name="headline"
                  value={form.headline}
                  onChange={handleChange}
                  placeholder="e.g., Senior Frontend Developer, React Specialist"
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-[#272d68] focus:outline-none focus:ring-1 focus:ring-[#272d68]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Availability Status
                </label>
                <select
                  name="searchStatus"
                  value={form.searchStatus}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-[#272d68] focus:outline-none focus:ring-1 focus:ring-[#272d68]"
                >
                  <option value="ACTIVE">Active Search - Open to Work</option>
                  <option value="PASSIVE">Not Looking</option>
                  <option value="HIRED">Currently employed</option>
                </select>
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                name="bio"
                rows={4}
                value={form.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself, your experience, and what you're looking for..."
                className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-[#272d68] focus:outline-none focus:ring-1 focus:ring-[#272d68]"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiPhone className="text-[#272d68]/50" /> Contact Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-[#272d68] focus:outline-none focus:ring-1 focus:ring-[#272d68]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="City"
                  className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-[#272d68] focus:outline-none focus:ring-1 focus:ring-[#272d68]"
                />
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiFileText className="text-[#272d68]/50" /> Resume / CV
            </h3>
            <div className="space-y-4">
              {form.resumeUrl ? (
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-center gap-3">
                    <FiFileText className="h-8 w-8 text-[#272d68]/50" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Current Resume
                      </p>
                      <p className="text-xs text-gray-500">
                        {form.resumeUrl.split("/").pop()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <a
                      href={`${process.env.NEXT_PUBLIC_API_URL}${form.resumeUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-gray-600 hover:text-blue-600 transition"
                    >
                      <FiEye className="h-5 w-5" />
                    </a>
                    <button
                      type="button"
                      onClick={() => resumeInputRef.current?.click()}
                      className="p-2 text-gray-600 hover:text-blue-600 transition"
                    >
                      <FiUpload className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => resumeInputRef.current?.click()}
                  className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition text-center"
                  disabled={uploadingResume}
                >
                  {uploadingResume ? (
                    <div className="flex items-center justify-center gap-2">
                      <FiLoader className="h-5 w-5 animate-spin text-[#272d68]/50" />
                      <span className="text-sm text-gray-600">
                        Uploading...
                      </span>
                    </div>
                  ) : (
                    <>
                      <FiUpload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                      <p className="text-sm text-gray-600">
                        Click to upload your resume
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        PDF or DOC (Max 10MB)
                      </p>
                    </>
                  )}
                </button>
              )}
              <input
                ref={resumeInputRef}
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={onResumeSelect}
                className="hidden"
              />
            </div>
          </div>

          {/* Social Links */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiGlobe className="text-[#272d68]/50" /> Professional Links
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiLinkedin className="text-[#272d68] h-5 w-5" />
                <input
                  name="linkedin"
                  placeholder="LinkedIn Profile URL"
                  value={form.linkedin}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiGithub className="text-[#272d68] h-5 w-5" />
                <input
                  name="github"
                  placeholder="GitHub Profile URL"
                  value={form.github}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                <FiGlobe className="text-[#272d68] h-5 w-5" />
                <input
                  name="portfolioUrl"
                  placeholder="Portfolio/Personal Website"
                  value={form.portfolioUrl}
                  onChange={handleChange}
                  className="flex-1 bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiBriefcase className="text-[#272d68]/50" /> Technical Skills
            </h3>
            <div className="flex gap-2 mb-3">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addSkill())
                }
                placeholder="Type a skill and press Enter..."
                className="flex-1 rounded-lg border border-gray-300 bg-white p-2.5 text-sm text-gray-900 focus:border-[#272d68] focus:outline-none focus:ring-1 focus:ring-[#272d68]"
              />
              <button
                type="button"
                onClick={addSkill}
                className="px-4 py-2 bg-[#272d68] text-white rounded-lg hover:bg-[#08A4A3] transition"
              >
                <FiPlus />
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 px-3 py-1.5 rounded-lg text-sm text-[#272d68]"
                >
                  {skill}
                  <FiTrash2
                    className="cursor-pointer text-[#272d68] hover:text-red-500 h-3.5 w-3.5"
                    onClick={() =>
                      setSkills(skills.filter((_, idx) => idx !== i))
                    }
                  />
                </span>
              ))}
            </div>
          </div>

          {/* Education Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiFileText className="text-[#272d68]/50" /> Education
            </h3>
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  placeholder="School Or College Name"
                  value={eduInput.institution}
                  onChange={(e) =>
                    setEduInput({ ...eduInput, institution: e.target.value })
                  }
                  className="rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-[#272d68] focus:outline-none"
                />
                <input
                  placeholder="Degree Name"
                  value={eduInput.degree}
                  onChange={(e) =>
                    setEduInput({ ...eduInput, degree: e.target.value })
                  }
                  className="rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-[#272d68] focus:outline-none"
                />
                <input
                  placeholder="Field of Study (IT,CS,etc.)"
                  value={eduInput.fieldOfStudy}
                  onChange={(e) =>
                    setEduInput({ ...eduInput, fieldOfStudy: e.target.value })
                  }
                  className="rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-[#272d68] focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="Start Year"
                  value={eduInput.startYear}
                  onChange={(e) =>
                    setEduInput({
                      ...eduInput,
                      startYear: Number(e.target.value),
                    })
                  }
                  className="rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-[#272d68] focus:outline-none"
                />
                <input
                  type="number"
                  placeholder="End Year (Leave empty if current)"
                  value={eduInput.endYear || ""}
                  onChange={(e) =>
                    setEduInput({
                      ...eduInput,
                      endYear: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  className="rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-[#272d68] focus:outline-none"
                />
              </div>
              <button
                type="button"
                onClick={addEducation}
                className="w-full py-2 bg-[#272d68] text-white rounded-lg hover:bg-[#08A4A3] transition text-sm font-medium"
              >
                Add Education
              </button>
            </div>
            <div className="space-y-2">
              {education.map((edu, i) => (
                <div
                  key={i}
                  className="flex justify-between items-start p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {edu.institution}
                    </p>
                    <p className="text-sm text-gray-600">
                      {edu.degree} in {edu.fieldOfStudy}
                    </p>
                    <p className="text-xs text-gray-400">
                      {edu.startYear} - {edu.endYear || "Present"}
                    </p>
                  </div>
                  <FiTrash2
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                    onClick={() =>
                      setEducation(education.filter((_, idx) => idx !== i))
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Experience Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiBriefcase className="text-[#272d68]/50" /> Work Experience
            </h3>
            <div className="space-y-3 p-4 bg-gray-50 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  placeholder="Company"
                  value={expInput.company}
                  onChange={(e) =>
                    setExpInput({ ...expInput, company: e.target.value })
                  }
                  className="rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-[#272d68] focus:outline-none"
                />
                <input
                  placeholder="Position"
                  value={expInput.position}
                  onChange={(e) =>
                    setExpInput({ ...expInput, position: e.target.value })
                  }
                  className="rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-[#272d68] focus:outline-none"
                />
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Start Date</label>
                  <input
                    type="date"
                    value={expInput.startDate}
                    onChange={(e) =>
                      setExpInput({ ...expInput, startDate: e.target.value })
                    }
                    className="rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-[#272d68] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">End Date</label>
                  <input
                    type="date"
                    value={expInput.endDate || ""}
                    onChange={(e) =>
                      setExpInput({
                        ...expInput,
                        endDate: e.target.value || null,
                      })
                    }
                    className="rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-[#272d68] focus:outline-none"
                  />
                </div>
              </div>
              <textarea
                placeholder="Description of your responsibilities and achievements..."
                rows={3}
                value={expInput.description}
                onChange={(e) =>
                  setExpInput({ ...expInput, description: e.target.value })
                }
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-[#272d68] focus:outline-none"
              />
              <button
                type="button"
                onClick={addExperience}
                className="w-full py-2 bg-[#272d68] text-white rounded-lg hover:bg-[#08A4A3] transition text-sm font-medium"
              >
                Add Experience
              </button>
            </div>
            <div className="space-y-2">
              {experience.map((exp, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {exp.position}
                      </p>
                      <p className="text-sm text-gray-600">{exp.company}</p>
                      <p className="text-xs text-gray-400">
                        {exp.startDate} - {exp.endDate || "Present"}
                      </p>
                      {exp.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {exp.description}
                        </p>
                      )}
                    </div>
                    <FiTrash2
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                      onClick={() =>
                        setExperience(experience.filter((_, idx) => idx !== i))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Certification Section */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <FiAward className="text-[#272d68]/50" />
              Certifications
            </h3>

            <div className="space-y-3 p-4 bg-gray-50 rounded-lg mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input
                  placeholder="Certification Name"
                  value={certInput.certificationName}
                  onChange={(e) =>
                    setCertInput({
                      ...certInput,
                      certificationName: e.target.value,
                    })
                  }
                  className="rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-[#272d68] focus:outline-none"
                />

                <input
                  placeholder="Organization / Issuer"
                  value={certInput.organization}
                  onChange={(e) =>
                    setCertInput({
                      ...certInput,
                      organization: e.target.value,
                    })
                  }
                  className="rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-[#272d68] focus:outline-none"
                />

                <input
                  placeholder="Mode (Online / Offline)"
                  value={certInput.mode}
                  onChange={(e) =>
                    setCertInput({
                      ...certInput,
                      mode: e.target.value,
                    })
                  }
                  className="rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-[#272d68] focus:outline-none"
                />

                <input
                  placeholder="Certification Link"
                  value={certInput.certificationLink}
                  onChange={(e) =>
                    setCertInput({
                      ...certInput,
                      certificationLink: e.target.value,
                    })
                  }
                  className="rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-[#272d68] focus:outline-none"
                />
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">Start Date</label>
                  <input
                    type="date"
                    value={certInput.startDate}
                    onChange={(e) =>
                      setCertInput({
                        ...certInput,
                        startDate: e.target.value,
                      })
                    }
                    className="rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-[#272d68] focus:outline-none"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-gray-400">End Date</label>
                  <input
                    type="date"
                    value={certInput.endDate || ""}
                    onChange={(e) =>
                      setCertInput({
                        ...certInput,
                        endDate: e.target.value || null,
                      })
                    }
                    className="rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-[#272d68] focus:outline-none"
                  />
                </div>
              </div>

              <textarea
                placeholder="Certification description..."
                rows={3}
                value={certInput.description}
                onChange={(e) =>
                  setCertInput({
                    ...certInput,
                    description: e.target.value,
                  })
                }
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm focus:border-[#272d68] focus:outline-none"
              />

              <button
                type="button"
                onClick={addCertification}
                className="w-full py-2 bg-[#272d68] text-white rounded-lg hover:bg-[#08A4A3] transition text-sm font-medium"
              >
                Add Certification
              </button>
            </div>

            <div className="space-y-2">
              {certifications.map((cert, i) => (
                <div key={i} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">
                        {cert.certificationName}
                      </p>

                      <p className="text-sm text-gray-600">
                        {cert.organization}
                      </p>

                      <p className="text-xs text-gray-400">
                        {cert.startDate} - {cert.endDate || "Present"}
                      </p>

                      {cert.mode && (
                        <p className="text-xs text-blue-600 mt-1">
                          {cert.mode}
                        </p>
                      )}

                      {cert.description && (
                        <p className="text-sm text-gray-600 mt-1">
                          {cert.description}
                        </p>
                      )}

                      {cert.certificationLink && (
                        <a
                          href={cert.certificationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-[#08A4A3] hover:underline mt-1 block"
                        >
                          View Certificate
                        </a>
                      )}
                    </div>

                    <FiTrash2
                      className="text-gray-400 hover:text-red-500 cursor-pointer"
                      onClick={() =>
                        setCertifications(
                          certifications.filter((_, idx) => idx !== i),
                        )
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
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
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
