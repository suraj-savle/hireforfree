import Link from "next/link";
import {
  Users,
  Eye,
  Zap,
  Sparkles,
  TrendingUp,
  Clock,
  Database,
  Bot,
  ArrowRight,
  CheckCircle,
  Star,
} from "lucide-react";

export default function TalentSection() {
  return (
    <section className="w-full bg-white py-20 sm:py-28 md:py-32 px-4 sm:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-left mb-10 md:mb-12">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-[#272d68] mb-4">
            Got talent?
          </h2>
          <p className="text-lg sm:text-xl text-[#272d68]/70 max-w-2xl">
            Whether you&apos;re looking for your next role or your next hire, we&apos;ve
            got you covered
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Job Seekers */}
          <div className="bg-linear-to-br from-[#ceeeed]/20 to-white rounded-3xl border border-[#08a4a3]/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="p-6 sm:p-8 md:p-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#08a4a3]/10 rounded-full mb-6">
                <Users className="w-4 h-4 text-[#08a4a3]" />
                <span className="text-xs sm:text-sm font-semibold text-[#08a4a3]">
                  For Job Seekers
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#272d68] mb-4">
                Why job seekers love us
              </h3>

              <p className="text-[#272d68]/70 text-base sm:text-lg mb-8 leading-relaxed">
                Connect directly with founders at top startups - no third party
                recruiters allowed.
              </p>

              {/* Features List */}
              <div className="space-y-6 mb-8 sm:mb-10">
                <div className="flex items-start gap-3 group/item">
                  <div className="w-6 h-6 rounded-full bg-[#08a4a3]/20 flex items-center justify-center mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform">
                    <Eye className="w-3.5 h-3.5 text-[#08a4a3]" />
                  </div>
                  <p className="text-sm sm:text-base text-[#272d68]/80 leading-relaxed">
                    <span className="font-semibold text-[#272d68]">
                      Everything you need to know, all upfront.
                    </span>{" "}
                    View salary, stock options, and more before applying.
                  </p>
                </div>

                <div className="flex items-start gap-3 group/item">
                  <div className="w-6 h-6 rounded-full bg-[#08a4a3]/20 flex items-center justify-center mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform">
                    <Zap className="w-3.5 h-3.5 text-[#08a4a3]" />
                  </div>
                  <p className="text-sm sm:text-base text-[#272d68]/80 leading-relaxed">
                    <span className="font-semibold text-[#272d68]">
                      Say goodbye to cover letters
                    </span>{" "}
                    - your profile is all you need. One click to apply and
                    you&apos;re done.
                  </p>
                </div>

                <div className="flex items-start gap-3 group/item">
                  <div className="w-6 h-6 rounded-full bg-[#08a4a3]/20 flex items-center justify-center mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform">
                    <Sparkles className="w-3.5 h-3.5 text-[#08a4a3]" />
                  </div>
                  <p className="text-sm sm:text-base text-[#272d68]/80 leading-relaxed">
                    <span className="font-semibold text-[#272d68]">
                      Unique jobs
                    </span>{" "}
                    at startups and tech companies you can&apos;t find anywhere else.
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/help"
                  className="group/btn inline-flex items-center justify-center gap-2 text-[#08a4a3] font-semibold text-sm sm:text-base hover:gap-3 transition-all duration-300"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
                <Link
                  href="/login"
                  className="bg-linear-to-r from-[#272d68] to-[#08a4a3] text-white px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm sm:text-base text-center hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Sign up as candidate
                </Link>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="h-1 w-full bg-linear-to-r from-[#08a4a3] to-[#272d68] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </div>

          {/* Right Column - Recruiters */}
          <div className="bg-linear-to-br from-[#272d68]/5 to-white rounded-3xl border border-[#08a4a3]/10 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 group">
            <div className="p-6 sm:p-8 md:p-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#08a4a3]/10 rounded-full mb-6">
                <TrendingUp className="w-4 h-4 text-[#08a4a3]" />
                <span className="text-xs sm:text-sm font-semibold text-[#08a4a3]">
                  For Recruiters
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#272d68] mb-4">
                Why recruiters love us
              </h3>

              <p className="text-[#272d68]/70 text-base sm:text-lg mb-8 leading-relaxed">
                Tap into a community of{" "}
                <span className="font-bold text-[#08a4a3]">10M+</span> engaged,
                startup-ready candidates.
              </p>

              {/* Features List */}
              <div className="space-y-6 mb-8 sm:mb-10">
                <div className="flex items-start gap-3 group/item">
                  <div className="w-6 h-6 rounded-full bg-[#08a4a3]/20 flex items-center justify-center mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform">
                    <Clock className="w-3.5 h-3.5 text-[#08a4a3]" />
                  </div>
                  <p className="text-sm sm:text-base text-[#272d68]/80 leading-relaxed">
                    <span className="font-semibold text-[#272d68]">
                      Everything you need to kickstart your recruiting
                    </span>{" "}
                    — set up job posts, company branding, and HR tools within 10
                    minutes, all for free.
                  </p>
                </div>

                <div className="flex items-start gap-3 group/item">
                  <div className="w-6 h-6 rounded-full bg-[#08a4a3]/20 flex items-center justify-center mt-0.5 flex-shrink-0 group-hover/item:scale-110 transition-transform">
                    <Database className="w-3.5 h-3.5 text-[#08a4a3]" />
                  </div>
                  <p className="text-sm sm:text-base text-[#272d68]/80 leading-relaxed">
                    <span className="font-semibold text-[#272d68]">
                      A free applicant tracking system
                    </span>
                    , or free integration with any ATS you may already use.
                  </p>
                </div>

                <div className="flex items-start gap-3 group/item">
                  <div className="w-6 h-6 rounded-full bg-[#08a4a3]/20 flex items-center justify-center mt-0.5 shrink-0 group-hover/item:scale-110 transition-transform">
                    <Bot className="w-3.5 h-3.5 text-[#08a4a3]" />
                  </div>
                  <p className="text-sm sm:text-base text-[#272d68]/80 leading-relaxed">
                    <span className="font-semibold text-[#272d68]">
                      Let us handle the heavy-lifting with RecruiterCloud.
                    </span>{" "}
                    Our new AI-Recruiter scans 500M+ candidates, filters it down
                    based on your unique calibration, and schedules your
                    favorites on your calendar in a matter of days.
                  </p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/help"
                  className="group/btn inline-flex items-center justify-center gap-2 text-[#08a4a3] font-semibold text-sm sm:text-base hover:gap-3 transition-all duration-300"
                >
                  Learn more
                  <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                </Link>
                <Link
                  href="/login"
                  className="bg-linear-to-r from-[#272d68] to-[#08a4a3] text-white px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm sm:text-base text-center hover:shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                >
                  Sign up as recruiter
                </Link>
              </div>
            </div>

            {/* Decorative Element */}
            <div className="h-1 w-full bg-linear-to-r from-[#08a4a3] to-[#272d68] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          </div>
        </div>

        {/* Bottom Trust Banner */}
        <div className="mt-16 sm:mt-20 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-8 bg-[#ceeeed]/30 rounded-full px-6 sm:px-8 py-3 sm:py-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#08a4a3]" />
              <span className="text-xs sm:text-sm text-[#272d68]/80">
                100% free for everyone
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-[#08a4a3] fill-[#08a4a3]" />
              <span className="text-xs sm:text-sm text-[#272d68]/80">
                Trusted bycompanies
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-[#08a4a3]" />
              <span className="text-xs sm:text-sm text-[#272d68]/80">
                active job seekers
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
