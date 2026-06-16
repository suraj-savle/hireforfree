"use client";

import { useState } from "react";
import { Gift, Copy, CheckCircle2, Share2, Mail, Users } from "lucide-react";
import Navbar from "@/components/candidates/Navbar";

export default function ReferPage() {
  const [copied, setCopied] = useState(false);
  const referralLink = "https://hire4free.com/register?ref=user123";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative">
      {/* Floating Back Button */}
      <div>
        <Navbar />
      </div>

      {/* Hero Banner */}
      <section className="w-full bg-linear-to-br from-[#272d68] via-[#1e3d64] to-[#08a4a3] py-24 px-6 text-center text-white relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#ceeeed]">
            Grow The Community
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">
            Invite Peers. Build Networks.
          </h1>
          <p className="text-[#ceeeed]/80 text-sm sm:text-base max-w-xl mx-auto font-medium">
            Help your friends skip placement margins and connect directly with
            top-tier startup founders and companies.
          </p>
        </div>
      </section>

      {/* Main content body */}
      <section className="max-w-4xl mx-auto px-6 py-16 w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Left Side: Link Generation */}
        <div className="md:col-span-7 bg-white p-8 rounded-2xl border border-[#272d68]/5 shadow-sm space-y-6">
          <h2 className="text-xl font-extrabold text-[#272d68]">
            Your Unique Invite Link
          </h2>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-[#272d68]/50 tracking-wider">
              Share via Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                readOnly
                value={referralLink}
                className="w-full bg-slate-50 border border-[#272d68]/10 rounded-xl px-4 py-3 text-sm font-semibold text-[#272d68] outline-none"
              />
              <button
                onClick={handleCopy}
                className="px-5 py-3 rounded-xl bg-[#08a4a3] hover:bg-[#068c8b] text-white font-bold text-sm transition-all flex items-center gap-2 shrink-0 shadow-sm"
              >
                {copied ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
                <span>{copied ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-3">
            <a
              href={`mailto:?subject=Join Hire4Free&body=${referralLink}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#272d68]/10 text-xs font-bold text-[#272d68]/70 hover:bg-slate-50 transition"
            >
              <Mail className="w-4 h-4 text-[#08a4a3]" /> Invite via Email
            </a>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#272d68]/10 text-xs font-bold text-[#272d68]/70 hover:bg-slate-50 transition">
              <Share2 className="w-4 h-4 text-[#272d68]" /> Alternate Share
            </button>
          </div>
        </div>

        {/* Right Side: How it helps info cards */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white p-6 rounded-2xl border border-[#272d68]/5 shadow-sm flex gap-4 items-start">
            <div className="p-3 bg-[#08a4a3]/10 text-[#08a4a3] rounded-xl">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#272d68]">
                For Job Seekers
              </h3>
              <p className="text-[#272d68]/60 text-xs mt-1 leading-relaxed">
                Gives them immediate bypass tools to reach recruiting
                decision-makers without third-party filters.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#272d68]/5 shadow-sm flex gap-4 items-start">
            <div className="p-3 bg-[#272d68]/5 text-[#272d68] rounded-xl">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#272d68]">
                Ecosystem Impact
              </h3>
              <p className="text-[#272d68]/60 text-xs mt-1 leading-relaxed">
                More applicants pull in more high-quality employers, securing
                the permanent free nature of our codebases.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Corporate Governance Footnote */}
      <footer className="text-center py-10 text-xs font-medium text-[#272d68]/40 border-t border-[#272d68]/5">
        Powered by Shunya Tattva Management Consultants.
      </footer>
    </div>
  );
}
