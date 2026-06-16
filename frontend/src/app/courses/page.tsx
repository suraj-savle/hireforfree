"use client";

import { useState, useMemo } from "react";
import {
  BookOpen,
  Clock,
  GraduationCap,
  Search,
  MessageSquare,
  ArrowUpRight,
  X,
  Mail,
  Building,
  Phone,
  PhoneCall,
} from "lucide-react";
import Navbar from "@/components/candidates/Navbar";

interface AcademicProgram {
  id: string;
  name: string;
  university: string;
  mode: string;
  level: "PG" | "UG" | "Diploma" | "All Levels";
  duration: string;
  tuitionFee: number | null;
  email: string;
  phone: string; // Added phone channels
}

export default function AcademicProgramsPage() {
  const [programs] = useState<AcademicProgram[]>([
    {
      id: "1",
      name: "MBA",
      university: "VGU(ICA)",
      mode: "Online",
      level: "PG",
      duration: "2 years",
      tuitionFee: null,
      email: "designer@shunyatattva.co.in",
      phone: "+91 80979 47900",
    },
    {
      id: "2",
      name: "BBA",
      university: "Shobhit University",
      mode: "Online",
      level: "UG",
      duration: "3 Years",
      tuitionFee: null,
      email: "designer@shunyatattva.co.in",
      phone: "+91 80979 47901",
    },
    {
      id: "3",
      name: "IATA Certification",
      university: "Independent / Partner Board",
      mode: "Online/ Offline",
      level: "All Levels",
      duration: "6 Months",
      tuitionFee: 84000,
      email: "designer@shunyatattva.co.in",
      phone: "+91 80979 47902",
    },
    {
      id: "4",
      name: "HR Program",
      university: "EarnReady Academy",
      mode: "Online",
      level: "Diploma",
      duration: "6 Month",
      tuitionFee: 35000,
      email: "designer@shunyatattva.co.in",
      phone: "+91 80979 47900",
    },
    {
      id: "5",
      name: "HR Program With AI",
      university: "Rajeev Gandhi College of Management Studies",
      mode: "Online",
      level: "Diploma",
      duration: "6 Month",
      tuitionFee: 51000,
      email: "designer@shunyatattva.co.in",
      phone: "+91 80979 47900",
    },
  ]);

  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [selectedContactProgram, setSelectedContactProgram] =
    useState<AcademicProgram | null>(null);

  const filteredPrograms = useMemo(() => {
    return programs.filter((program) => {
      const matchesSearch =
        program.name.toLowerCase().includes(search.toLowerCase()) ||
        program.university.toLowerCase().includes(search.toLowerCase());

      const matchesTab =
        activeTab === "ALL" ||
        program.level.toUpperCase() === activeTab.toUpperCase();

      return matchesSearch && matchesTab;
    });
  }, [programs, search, activeTab]);

  return (
    <div>
      <div>
        <Navbar />
      </div>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 text-[#272d68]">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-6 w-full">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              Academic Programs Information
            </h1>
            <p className="text-sm font-medium text-[#272d68]/60">
              Browse through our available degree paths, diplomas, and dynamic
              institutional certifications.
            </p>
          </div>
        </div>

        {/* Control Bar */}
        <div className="w-full flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white p-4 border border-[#272d68]/10 rounded-2xl shadow-sm">
          <div className="relative flex-1 max-w-md w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#272d68]/30 w-5 h-5" />
            <input
              type="text"
              placeholder="Search programs or universities..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-[#272d68]/10 rounded-xl text-sm font-semibold focus:ring-4 focus:ring-[#08a4a3]/5 focus:border-[#08a4a3]/40 outline-none transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-1 bg-slate-100 p-1 rounded-xl self-start lg:self-auto">
            {["ALL", "PG", "UG", "DIPLOMA", "ALL LEVELS"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  activeTab === tab
                    ? "bg-[#272d68] text-white shadow-sm"
                    : "text-[#272d68]/60 hover:text-[#272d68] hover:bg-white/50"
                }`}
              >
                {tab === "ALL LEVELS" ? "Certifications" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid Fix: Enforced rigid table structure mapping system */}
        {filteredPrograms.length === 0 ? (
          <div className="w-full text-center py-20 bg-white border border-[#272d68]/10 rounded-3xl">
            <BookOpen className="w-12 h-12 text-[#272d68]/10 mx-auto mb-4" />
            <h3 className="text-lg font-bold">
              No academic programs match criteria
            </h3>
            <p className="text-sm text-[#272d68]/50 mt-1">
              Try modifying your query or resetting your active tab filters.
            </p>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
            {filteredPrograms.map((program) => (
              <div
                key={program.id}
                className="w-full bg-white border border-[#272d68]/10 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#08a4a3]/30 transition-all duration-300 flex flex-col justify-between relative overflow-hidden h-full group"
              >
                <div
                  className={`absolute top-0 left-0 right-0 h-1.5 ${
                    program.level === "PG"
                      ? "bg-indigo-500"
                      : program.level === "UG"
                        ? "bg-[#08a4a3]"
                        : program.level === "Diploma"
                          ? "bg-amber-500"
                          : "bg-purple-500"
                  }`}
                />

                <div className="mb-6 flex-1">
                  <div className="flex items-center justify-between mb-4 mt-1">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase border ${
                        program.level === "PG"
                          ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                          : program.level === "UG"
                            ? "bg-teal-50 border-teal-200 text-teal-700"
                            : program.level === "Diploma"
                              ? "bg-amber-50 border-amber-200 text-amber-700"
                              : "bg-purple-50 border-purple-200 text-purple-700"
                      }`}
                    >
                      {program.level} Target
                    </span>
                    <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                      {program.mode}
                    </span>
                  </div>

                  <div className="space-y-1 mb-5">
                    <h3 className="text-xl font-black tracking-tight leading-snug group-hover:text-[#08a4a3] transition-colors min-h-[56px] line-clamp-2">
                      {program.name}
                    </h3>
                    <p className="text-sm font-bold text-[#272d68]/50 flex items-center gap-1.5 line-clamp-1">
                      <GraduationCap className="w-4 h-4 shrink-0 text-[#272d68]/30" />
                      {program.university || "Direct Certification Path"}
                    </p>
                  </div>

                  <div className="space-y-2.5 border-t border-slate-100 pt-4">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#272d68]/40 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" /> Duration
                      </span>
                      <span className="font-bold">{program.duration}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-[#272d68]/40 flex items-center gap-1.5">
                         Tuition
                        Cost
                      </span>
                      <span
                        className={`font-extrabold ${program.tuitionFee ? "text-emerald-600" : "text-slate-400"}`}
                      >
                        {program.tuitionFee
                          ? `₹ ${program.tuitionFee.toLocaleString("en-IN")}.00`
                          : "Contact for Pricing"}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedContactProgram(program)}
                  className="w-full flex items-center justify-center gap-2 border border-[#272d68]/10 bg-slate-50 text-[#272d68] hover:bg-[#272d68] hover:text-white hover:border-[#272d68] py-2.5 rounded-xl text-xs font-bold tracking-wide shadow-sm transition-all duration-200 mt-auto active:scale-[0.98]"
                >
                  <MessageSquare className="w-4 h-4 shrink-0" />
                  <span>Connect / Call Support</span>
                  <ArrowUpRight className="w-3.5 h-3.5 opacity-60 ml-0.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Interactive Contact Drawer Modal */}
        {selectedContactProgram && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-200">
              <div className="p-6 bg-slate-50 border-b border-gray-100 flex items-start justify-between">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-[#08a4a3] uppercase tracking-wider px-2 py-0.5 bg-[#08a4a3]/5 rounded">
                    Instant Access Directory
                  </span>
                  <h3 className="text-lg font-black tracking-tight mt-1">
                    Connect: {selectedContactProgram.name}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedContactProgram(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-200/60 hover:text-[#272d68] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <Building className="w-5 h-5 text-[#272d68]/40 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">
                        Institution
                      </p>
                      <p className="text-sm font-bold">
                        {selectedContactProgram.university}
                      </p>
                    </div>
                  </div>

                  {/* Email Option */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl group/item">
                    <div className="flex items-center gap-3 min-w-0">
                      <Mail className="w-5 h-5 text-[#272d68]/40 shrink-0" />
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          Email Support
                        </p>
                        <p className="text-xs font-semibold text-[#272d68] truncate font-mono">
                          {selectedContactProgram.email}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`mailto:${selectedContactProgram.email}?subject=Inquiry: ${selectedContactProgram.name}`}
                      className="ml-2 p-2 bg-[#ceeeed]/40 hover:bg-[#08a4a3] text-[#08a4a3] hover:text-white rounded-lg transition-all text-xs font-bold"
                    >
                      Email
                    </a>
                  </div>

                  {/* Phone Configuration Link */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-[#272d68]/40 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase">
                          Admissions Helpline
                        </p>
                        <p className="text-sm font-bold text-[#272d68] font-mono">
                          {selectedContactProgram.phone}
                        </p>
                      </div>
                    </div>
                    <a
                      href={`tel:${selectedContactProgram.phone.replace(/\s+/g, "")}`}
                      className="p-2 bg-emerald-50 hover:bg-emerald-600 text-emerald-600 hover:text-white rounded-lg transition-all flex items-center gap-1 text-xs font-bold border border-emerald-100"
                    >
                      <PhoneCall className="w-3.5 h-3.5" />
                      <span>Call Now</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-slate-50 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedContactProgram(null)}
                  className="px-5 py-2 bg-slate-200/70 hover:bg-slate-200 text-[#272d68] rounded-xl text-xs font-bold transition-colors"
                >
                  Close Panel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
