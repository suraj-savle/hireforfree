import Link from "next/link";
import {
  Zap,
  Sliders,
  Eye,
  Search,
  Sparkles,
  MessageSquare,
  Award,
  Rocket,
  TrendingUp,
} from "lucide-react";

export default function Features() {
  return (
    <section className="w-full bg-white py-16 sm:py-20 md:py-24 px-4 sm:px-6 space-y-20 sm:space-y-28 md:space-y-32">
      <div className="max-w-7xl mx-auto">
        {/* Step 1: Brand Yourself */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-block px-3 py-1 bg-[#ceeeed] text-[#08a4a3] text-xs sm:text-sm font-semibold rounded-full mb-4">
              Step 01
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#272d68] leading-tight">
              Brand yourself for new opportunities
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#272d68]/70 max-w-2xl mx-auto">
              Create a profile that highlights your unique skills and
              preferences, then apply to jobs with just one click.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {/* Card 1 */}
            <div className="group bg-[#ceeeed]/30 p-6 sm:p-8 rounded-2xl border border-[#08a4a3]/10 space-y-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#272d68] text-[#ceeeed] flex items-center justify-center transition-transform group-hover:scale-110">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#272d68]">
                One click apply
              </h3>
              <p className="text-[#272d68]/80 text-sm sm:text-base leading-relaxed">
                Say goodbye to cover letters - your profile is all you need. One
                click to apply then you&apos;re done.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-[#ceeeed]/30 p-6 sm:p-8 rounded-2xl border border-[#08a4a3]/10 space-y-4 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
              <div className="w-12 h-12 rounded-xl bg-[#08a4a3] text-white flex items-center justify-center transition-transform group-hover:scale-110">
                <Sliders className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-[#272d68]">
                Set your preferences
              </h3>
              <p className="text-[#272d68]/80 text-sm sm:text-base leading-relaxed">
                Streamline the interview process by setting your expectations
                (salary, industry, culture, etc.) upfront.
              </p>
            </div>

            {/* Card 3: CTA */}
            <div className="bg-linear-to-br from-[#272d68] to-[#1f2352] text-white p-6 sm:p-8 rounded-2xl flex flex-col justify-between items-start space-y-6 shadow-xl">
              <div>
                <Rocket className="w-8 h-8 text-[#08a4a3] mb-3" />
                <h3 className="text-xl sm:text-2xl font-bold">
                  Ready to stand out?
                </h3>
                <p className="text-white/70 text-sm sm:text-base mt-2 leading-relaxed">
                  Join thousands of students mapping out their next career
                  milestones.
                </p>
              </div>
              <Link
                href="/signup"
                className="bg-[#08a4a3] text-white text-sm sm:text-base font-semibold px-6 py-3 rounded-xl hover:bg-[#068786] transition-all duration-300 w-full text-center hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                Create your profile for free
              </Link>
            </div>
          </div>
        </div>

        <hr className="my-16 sm:my-20 md:my-24 border-[#272d68]/10" />

        {/* Step 2: Find Work That Works */}
        <div>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <span className="inline-block px-3 py-1 bg-[#ceeeed] text-[#08a4a3] text-xs sm:text-sm font-semibold rounded-full mb-4">
              Step 02
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#272d68] leading-tight">
              Find work that works for you
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[#272d68]/70 max-w-2xl mx-auto">
              A personalized and private job search, with all the info you care
              about, all upfront.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
            <div className="text-center md:text-left space-y-3 group">
              <div className="bg-[#ceeeed]/50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                <Eye className="w-5 h-5 text-[#08a4a3]" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-[#272d68]">
                Stay in the know
              </h4>
              <p className="text-sm sm:text-base text-[#272d68]/70">
                No guessing games. View salary and stock options before you
                apply.
              </p>
            </div>
            <div className="text-center md:text-left space-y-3 group">
              <div className="bg-[#ceeeed]/50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                <Search className="w-5 h-5 text-[#08a4a3]" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-[#272d68]">
                Personalized search
              </h4>
              <p className="text-sm sm:text-base text-[#272d68]/70">
                Personalized filters make it quick and easy to find the jobs you
                care about.
              </p>
            </div>
            <div className="text-center md:text-left space-y-3 group">
              <div className="bg-[#ceeeed]/50 w-12 h-12 rounded-xl flex items-center justify-center mx-auto md:mx-0 group-hover:scale-110 transition-transform">
                <Sparkles className="w-5 h-5 text-[#08a4a3]" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-[#272d68]">
                Unique roles, exciting teams
              </h4>
              <p className="text-sm sm:text-base text-[#272d68]/70">
                Discover unique jobs with future-defining teams.
              </p>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-2 text-[#08a4a3] font-bold hover:gap-3 transition-all duration-300 group"
            >
              Browse jobs
              <Award className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        <hr className="my-16 sm:my-20 md:my-24 border-[#272d68]/10" />

        {/* Step 3: Outbound pitches */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-linear-to-br from-[#ceeeed]/40 to-[#ceeeed]/20 p-6 sm:p-8 md:p-12 rounded-3xl">
          <div className="lg:col-span-5 space-y-4 sm:space-y-6">
            <span className="inline-block px-3 py-1 bg-[#272d68] text-white text-xs sm:text-sm font-semibold rounded-full">
              Step 03
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#272d68] leading-tight">
              Let the opportunities come to you
            </h2>
            <p className="text-[#272d68]/80 text-sm sm:text-base leading-relaxed">
              Skip traditional applying entirely. Build your network organically
              right from your profile.
            </p>
            <Link
              href="/signup"
              className="inline-block bg-[#272d68] text-white px-6 sm:px-8 py-3 rounded-xl font-semibold text-sm sm:text-base hover:bg-[#1f2352] transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
            >
              Get started
            </Link>
          </div>

          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#272d68]/5 space-y-3 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <MessageSquare className="w-5 h-5 text-[#08a4a3]" />
              <h4 className="font-bold text-[#272d68] text-base sm:text-lg">
                Connect with founders
              </h4>
              <p className="text-xs sm:text-sm text-[#272d68]/70 leading-relaxed">
                Let founders pitch you directly on their opportunity.
              </p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#272d68]/5 space-y-3 transition-all duration-300 hover:shadow-md hover:-translate-y-1">
              <TrendingUp className="w-5 h-5 text-[#08a4a3]" />
              <h4 className="font-bold text-[#272d68] text-base sm:text-lg">
                Get featured
              </h4>
              <p className="text-xs sm:text-sm text-[#272d68]/70 leading-relaxed">
                Feature your profile even further and make 3x more connections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
