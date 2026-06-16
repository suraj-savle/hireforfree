import Link from 'next/link';
import { TrendingUp, Sparkles } from 'lucide-react';

export default function HeroSection() {
  const popularSearches = ['Remote', 'Software Engineer', 'Marketing', 'Sales', 'Design', 'Data Science'];

  return (
    <section className="w-full h-screen flex items-center px-4 relative overflow-hidden bg-linear-to-br from-white via-[#ceeeed]/20 to-white">
      
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#08a4a3]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#272d68]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-[#ceeeed]/30 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10 w-full">
        <div className="text-center">
          
          {/* Status Badge */}
          <div className="inline-flex items-center space-x-2 bg-[#ceeeed]/50 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 border border-[#08a4a3]/20 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#08a4a3] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#08a4a3]"></span>
            </span>
            <span className="text-sm text-[#272d68] font-semibold">Direct Recruitment Platform</span>
            <Sparkles className="w-3.5 h-3.5 text-[#08a4a3]" />
          </div>
          
          {/* Main Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-tight">
            <span className="text-[#272d68]">Get</span>{' '}
            <span className="bg-linear-to-r from-[#272d68] to-[#08a4a3] bg-clip-text text-transparent">Hired</span>{' '}
            <span className="text-[#272d68]">Faster</span>
            <br className="hidden sm:block" />
            <span className="text-[#272d68]">Direct </span>
            <span className="relative inline-block">
              <span className="text-[#08a4a3]">Company↔Candidate</span>
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="text-base sm:text-lg md:text-xl text-[#272d68]/70 max-w-2xl mx-auto mb-8 px-4 font-medium">
            No middlemen. No placement cells. Just you and the companies you want to work for.
            Apply directly, track applications, and get hired.
          </p>

          {/* Popular Searches as Direct Links */}
          <div className="flex flex-wrap justify-center gap-2 text-sm px-4 items-center">
            <span className="text-[#272d68]/60 font-semibold flex items-center gap-1 mr-1">
              <TrendingUp className="w-4 h-4 text-[#08a4a3]" />
              Popular:
            </span>
            {popularSearches.map((term) => (
              <Link
                key={term}
                href={`/jobs?keyword=${encodeURIComponent(term)}`}
                className="text-[#272d68]/70 hover:text-[#08a4a3] px-3 py-1.5 hover:bg-[#ceeeed]/50 rounded-lg transition-all duration-200 font-medium hover:scale-105 inline-block"
              >
                {term}
              </Link>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}