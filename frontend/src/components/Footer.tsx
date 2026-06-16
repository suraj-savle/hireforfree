"use client";

import Link from "next/link";
export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-[#08a4a3]/10 mt-16 pt-16 pb-8 px-6 md:px-12 lg:px-16">
      <div className="max-w-7xl mx-auto">
        
        {/* Main Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-16">
          
          {/* Brand Presentation Column */}
          <div className="md:col-span-2 space-y-4 pr-0 md:pr-8">
            <Link href="/" className="text-xl font-extrabold text-[#272d68] tracking-tight">
              <span className="font-extrabold text-xl md:text-3xl text-[#272d68]">
                Hire
              </span>
              <span className="font-extrabold text-xl md:text-3xl text-[#08a4a3]">
                4
              </span>
              <span className="font-extrabold text-xl md:text-3xl text-[#272d68]">
                Free
              </span>
            </Link>
            <p className="text-[#272d68]/60 text-sm font-medium max-w-sm leading-relaxed">
              Connecting direct talent without operational margins. Apply directly to leading global employers transparently.
            </p>
          </div>

          {/* Links Column 1: For Candidates */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#272d68]/40">
              For Candidates
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/student" className="text-[#272d68]/70 hover:text-[#08a4a3] text-sm font-medium transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/student/jobs" className="text-[#272d68]/70 hover:text-[#08a4a3] text-sm font-medium transition-colors">
                  Startup Jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 2: For Companies */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#272d68]/40">
              For Companies
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/company" className="text-[#272d68]/70 hover:text-[#08a4a3] text-sm font-medium transition-colors">
                  Overview
                </Link>
              </li>
              <li>
                <Link href="/company/create-jobs" className="text-[#272d68]/70 hover:text-[#08a4a3] text-sm font-medium transition-colors">
                  Hiring candidates
                </Link>
              </li>
              <li>
                <Link href="/company/applications" className="text-[#272d68]/70 hover:text-[#08a4a3] text-sm font-medium transition-colors">
                  Applicant Profiles
                </Link>
              </li>
              <li>
                <Link href="/company/jobs" className="text-[#272d68]/70 hover:text-[#08a4a3] text-sm font-medium transition-colors">
                  jobs
                </Link>
              </li>
            </ul>
          </div>

          {/* Links Column 3: Browse Categories */}
          <div>
            <h3 className="font-bold text-sm uppercase tracking-wider mb-4 text-[#272d68]/40">
              Browse
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/student/jobs" className="text-[#272d68]/70 hover:text-[#08a4a3] text-sm font-medium transition-colors">
                  All Jobs
                </Link>
              </li>
              <li>
                <Link href="/Help" className="text-[#272d68]/70 hover:text-[#08a4a3] text-sm font-medium transition-colors">
                  Help
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-[#272d68]/70 hover:text-[#08a4a3] text-sm font-medium transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/refer" className="text-[#272d68]/70 hover:text-[#08a4a3] text-sm font-medium transition-colors">
                  Refer
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Lower Attribution Divider */}
        <div className="pt-8 border-t border-[#272d68]/10 flex items-center justify-center gap-4 text-center">
          <div className="space-y-0.5">
            <p className="text-[#272d68]/60 text-xs font-medium">
              Copyright © 2026 Hire4Free Systems.
            </p>
            <p className="text-[#272d68]/40 text-[11px] font-medium">
              Powered by Shunya Tattva Management Consultants.
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}