"use client";

import Link from "next/link";
import {
  ShieldCheck,
  Users,
  Coins,
  ArrowRight,
  CheckCircle2,
  Building2,
  GraduationCap,
} from "lucide-react";
import Navbar from "@/components/candidates/Navbar";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative">
      {/* FLOATING BACK BUTTON */}
      <div>
        <Navbar />
      </div>

      {/* HERO SECTION */}
      <section className="w-full bg-linear-to-br from-[#272d68] via-[#1e3d64] to-[#08a4a3] py-24 px-6 relative overflow-hidden text-white">
        {/* Decorative backdrop mesh elements */}
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-[500px] h-[500px] bg-[#ceeeed]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-6 mt-4">
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#ceeeed]">
            Our Mission
          </span>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Connecting Direct Talent <br />
            <span className="bg-linear-to-r from-[#ceeeed] to-white bg-clip-text text-transparent">
              Without Operational Margins.
            </span>
          </h1>
          <p className="text-[#ceeeed]/80 text-base sm:text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed">
            Hire4Free is a zero-margin ecosystem designed to eliminate the
            middleman. We connect ambitious student talent directly with
            verified startups and global corporations—completely free.
          </p>
        </div>
      </section>

      {/* CORE PURPOSE & VALUE PROPOSITION */}
      <section className="max-w-6xl mx-auto px-6 py-20 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-3xl font-extrabold text-[#272d68] tracking-tight leading-tight">
            Why Does <br />
            Hire4Free Exist?
          </h2>
          <p className="text-[#272d68]/70 text-sm sm:text-base font-medium leading-relaxed">
            Traditional recruitment infrastructure is broken. Aggregators
            squeeze margins out of young companies, while rigid corporate
            placement cells limit choices for outstanding student candidates.
          </p>
          <p className="text-[#272d68]/70 text-sm sm:text-base font-medium leading-relaxed">
            We believe that finding an early-career workplace shouldn’t be
            locked behind subscription paywalls or agency broker commissions.
            Hire4Free levels the playing field.
          </p>

          <div className="pt-2">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-[#08a4a3] hover:bg-[#068c8b] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#08a4a3]/10 transition-all active:scale-[0.99]"
            >
              Get Started Now <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Feature Grid Side Panel */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white border border-[#272d68]/5 p-6 rounded-2xl shadow-sm space-y-3">
            <div className="p-3 bg-[#08a4a3]/10 text-[#08a4a3] rounded-xl w-fit">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-[#272d68]">
              100% Free Software
            </h3>
            <p className="text-[#272d68]/60 text-xs font-medium leading-relaxed">
              No hidden operational charges, commissions, or platform upgrade
              locking metrics. Free mapping tools forever.
            </p>
          </div>

          <div className="bg-white border border-[#272d68]/5 p-6 rounded-2xl shadow-sm space-y-3">
            <div className="p-3 bg-[#272d68]/5 text-[#272d68] rounded-xl w-fit">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-[#272d68]">
              Direct Interactions
            </h3>
            <p className="text-[#272d68]/60 text-xs font-medium leading-relaxed">
              Direct company-to-candidate workflows. Skip independent
              third-party screeners and placement middlemen entirely.
            </p>
          </div>

          <div className="bg-white border border-[#272d68]/5 p-6 rounded-2xl shadow-sm space-y-3">
            <div className="p-3 bg-[#08a4a3]/10 text-[#08a4a3] rounded-xl w-fit">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-[#272d68]">
              Identity Verification
            </h3>
            <p className="text-[#272d68]/60 text-xs font-medium leading-relaxed">
              Multi-factor workspace OTP controls protect both corporate
              postings and candidate applications from spam.
            </p>
          </div>

          <div className="bg-white border border-[#272d68]/5 p-6 rounded-2xl shadow-sm space-y-3">
            <div className="p-3 bg-[#272d68]/5 text-[#272d68] rounded-xl w-fit">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-[#272d68]">
              Transparent Metrics
            </h3>
            <p className="text-[#272d68]/60 text-xs font-medium leading-relaxed">
              Track status parameters end-to-end dynamically inside your
              personalized workspace dashboards.
            </p>
          </div>
        </div>
      </section>

      {/* TWO WORKSPACE PORTALS SECTION */}
      <section className="w-full bg-white border-y border-[#272d68]/5 py-20 px-6">
        <div className="max-w-5xl mx-auto text-center mb-12 space-y-2">
          <h2 className="text-3xl font-extrabold text-[#272d68] tracking-tight">
            Tailored Workspaces
          </h2>
          <p className="text-[#272d68]/60 text-sm font-medium">
            An asymmetric platform optimized for both roles
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* For Candidates Card */}
          <div className="border border-[#272d68]/10 bg-slate-50/50 p-8 rounded-2xl space-y-4">
            <div className="p-3.5 bg-[#08a4a3] text-white rounded-xl w-fit">
              <GraduationCap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#272d68]">
              For Students & Talent
            </h3>
            <p className="text-[#272d68]/70 text-xs font-medium leading-relaxed">
              Build verified secure profile portfolios, match directly against
              active industry startups, and navigate recruitment pipelines
              safely without university boundaries.
            </p>
            <div className="pt-2">
              <Link
                href="/student/register"
                className="text-xs font-bold text-[#08a4a3] hover:underline underline-offset-4 flex items-center gap-1.5"
              >
                Create Student Workspace <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* For Companies Card */}
          <div className="border border-[#272d68]/10 bg-slate-50/50 p-8 rounded-2xl space-y-4">
            <div className="p-3.5 bg-[#272d68] text-white rounded-xl w-fit">
              <Building2 className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-extrabold text-[#272d68]">
              For Startups & Employers
            </h3>
            <p className="text-[#272d68]/70 text-xs font-medium leading-relaxed">
              Post unlimited technical or creative roles, view untampered
              candidate operational summaries, and message high-potential talent
              directly without processing fees.
            </p>
            <div className="pt-2">
              <Link
                href="/company/register"
                className="text-xs font-bold text-[#272d68] hover:underline underline-offset-4 flex items-center gap-1.5"
              >
                Create Company Workspace <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MANAGEMENT ATTRIBUTION FOOTNOTE */}
      <section className="max-w-4xl mx-auto text-center py-16 px-6 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-widest text-[#272d68]/40">
          Corporate Governance
        </h4>
        <p className="text-sm font-semibold text-[#272d68]/70 leading-relaxed max-w-xl mx-auto">
          Hire4Free Systems is conceptually built, deployed, and managed under
          the strategic management of
          <span className="text-[#272d68] font-bold">
            {" "}
            Shunya Tattva Management Consultants
          </span>
          .
        </p>
      </section>
    </div>
  );
}
