import Link from "next/link";
import { ArrowRight, Briefcase, UserPlus } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-linear-to-br from-[#ceeeed] via-[#ceeeed] to-[#e0f5f4] overflow-hidden px-4 sm:px-6 py-12 md:py-16">
      {/* Subtle decorative background accents */}
      <div className="absolute top-[-10%] right-[-10%] w-72 h-72 md:w-96 md:h-96 rounded-full bg-[#08a4a3] opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-5%] left-[-5%] w-64 h-64 rounded-full bg-[#272d68] opacity-10 blur-2xl pointer-events-none" />

      <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center justify-center w-full">
        {/* Main H1 Headline - Fixed text sizes */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-[#272d68] leading-[1.1] sm:leading-[1.2]">
          Find the job <span className="text-[#08a4a3]">made for you</span>
        </h1>

        {/* Subheading */}
        <div className="mt-4 sm:mt-6 md:mt-8">
          <h2 className="text-base sm:text-xl md:text-2xl lg:text-3xl font-semibold bg-linear-to-r from-[#272d68] to-[#08a4a3] bg-clip-text text-transparent">
            We make it easy to find what&apos;s next.
          </h2>
        </div>

        {/* Statistics Highlight */}
        <p className="mt-3 sm:mt-4 md:mt-6 text-sm sm:text-base md:text-lg text-[#272d68]/80 max-w-2xl font-medium px-4">
          Browse over 1000+
          <span className="absolute -top-1 -right-2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#08a4a3] rounded-full animate-ping" />
          jobs from top companies to fast-growing startups.
        </p>

        {/* Action Buttons */}
        <div className="mt-5 flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-5 w-full sm:w-auto px-4">
          <Link
            href="/create-profile"
            className="group relative bg-[#272d68] text-white font-semibold px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl text-sm sm:text-base md:text-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:bg-[#1f2352] active:scale-[0.98] text-center inline-flex items-center justify-center gap-2 overflow-hidden"
            aria-label="Create your profile"
          >
            <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
            <span>Create your profile</span>
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 opacity-0 -translate-x-4 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
          </Link>

          <Link
            href="/jobs"
            className="group bg-white text-[#272d68] border-2 border-[#272d68]/20 font-semibold px-5 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 rounded-xl text-sm sm:text-base md:text-lg shadow-sm transition-all duration-300 hover:border-[#08a4a3] hover:text-[#08a4a3] hover:shadow-md active:scale-[0.98] text-center inline-flex items-center justify-center gap-2"
            aria-label="Browse available job listings"
          >
            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Browse jobs</span>
          </Link>
        </div>

        {/* Optional: Add trust badge back for better balance */}
        <div className="mt-10 sm:mt-12 md:mt-16 flex items-center justify-center">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-[#272d68]/60 bg-white/40 px-3 sm:px-4 py-1.5 rounded-full backdrop-blur-sm">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-[#08a4a3] animate-pulse" />
            Always 100% free for students
          </div>
        </div>
      </div>
    </section>
  );
}
