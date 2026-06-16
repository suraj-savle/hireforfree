"use client";

import { Cookie, ShieldCheck, EyeOff, Info } from "lucide-react";
import Navbar from "@/components/candidates/Navbar";

export default function CookiePolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative">
      {/* Floating Back Button */}
      <div>
        <Navbar />
      </div>

      {/* Hero Banner */}
      <section className="w-full bg-linear-to-br from-[#272d68] via-[#1e3d64] to-[#08a4a3] py-20 px-6 text-center text-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-3 relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#ceeeed]">
            Legal Transparency
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight">
            Cookie Policy
          </h1>
          <p className="text-[#ceeeed]/80 text-sm font-medium">
            Last Updated: June 2026. Understand how data sessions preserve
            ecosystem speed.
          </p>
        </div>
      </section>

      {/* Content Columns */}
      <section className="max-w-4xl mx-auto px-6 py-16 w-full bg-white border border-[#272d68]/5 rounded-2xl shadow-sm my-10 space-y-8 text-sm text-[#272d68]/80 leading-relaxed">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#272d68]">
            <Cookie className="w-5 h-5 text-[#08a4a3]" />
            <h2 className="text-lg font-extrabold">
              1. Introduction to Cookie Processing
            </h2>
          </div>
          <p className="font-medium text-[#272d68]/70">
            Hire4Free Systems utilizes cookies and secure session tokens to
            maintain robust client dashboard states, secure multi-factor
            authentication sessions, and ensure programmatic data queries
            compile without friction.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#272d68]">
            <ShieldCheck className="w-5 h-5 text-[#08a4a3]" />
            <h2 className="text-lg font-extrabold">2. Essential Cookies</h2>
          </div>
          <p className="font-medium text-[#272d68]/70">
            These files are critical for user login validation and system
            optimization. They preserve your authorization state as you navigate
            between candidate dashboards and company job management setups.
            Disabling these options will break system rendering logic.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-[#272d68]">
            <EyeOff className="w-5 h-5 text-[#272d68]" />
            <h2 className="text-lg font-extrabold">
              3. Performance Analytics Tracking
            </h2>
          </div>
          <p className="font-medium text-[#272d68]/70">
            We track anonymized platform behavior metrics to measure feature
            performance and identify layout pain points. We never track your
            personal data, profile contents, or communication records across
            outside web domains.
          </p>
        </div>

        <div className="p-5 bg-slate-50 border border-[#272d68]/10 rounded-xl flex gap-3 items-start">
          <Info className="w-5 h-5 text-[#08a4a3] shrink-0 mt-0.5" />
          <p className="text-xs font-semibold text-[#272d68]/60 leading-relaxed">
            By continuing to access the Hire4Free interface pathways, you
            consent to our structural data configurations. Management reserves
            the right to adapt policy terms in coordination with Shunya Tattva
            Management Consultants governance frameworks.
          </p>
        </div>
      </section>

      {/* Footer Branding Footprint */}
      <footer className="text-center py-8 text-xs font-medium text-[#272d68]/40 border-t border-[#272d68]/5">
        © 2026 Hire4Free Systems • Powered by Shunya Tattva Management
        Consultants.
      </footer>
    </div>
  );
}
