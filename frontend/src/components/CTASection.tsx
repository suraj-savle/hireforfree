import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 px-4 bg-linear-to-br from-[#272d68] via-[#224f7c] to-[#08a4a3] relative overflow-hidden">
      {/* Subtle organic light flare to bring out the teal linear */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-white/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-4 md:mb-6 tracking-tight">
          Ready to start your career journey?
        </h2>

        <p className="text-base md:text-xl text-[#ceeeed] opacity-90 mb-8 md:mb-10 font-medium max-w-2xl mx-auto">
          Join thousands of job seekers and fast-growing companies on Hire4Free.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center px-4 max-w-md mx-auto sm:max-w-none">
          {/* Accent Brand Button (Teal Highlight to White Contrast) */}
          <Link
            href="/login"
            className="bg-white text-[#272d68] px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:shadow-black/10 transition-all hover:scale-[1.03] active:scale-[0.98] text-sm md:text-base text-center"
          >
            Get Started Free
          </Link>

          {/* Secondary Semi-Translucent Button */}
          <Link
            href="/jobs"
            className="border-2 border-white/20 bg-white/5 text-white px-6 md:px-8 py-3 md:py-4 rounded-xl font-bold backdrop-blur-sm hover:bg-white/10 hover:border-white/40 transition-all hover:scale-[1.03] active:scale-[0.98] text-sm md:text-base text-center"
          >
            Browse Jobs
          </Link>
        </div>

        <p className="text-xs md:text-sm text-[#ceeeed]/60 mt-6 md:mt-8 font-medium">
          Always 100% free for job seekers. Recruiters can post listings for
          free.
        </p>
      </div>
    </section>
  );
}
