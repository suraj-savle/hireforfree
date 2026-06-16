"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { UserPlus, Briefcase, X, Menu, ChevronDown } from "lucide-react";

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [registerDropdownOpen, setRegisterDropdownOpen] = useState(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".register-dropdown")) {
        setRegisterDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="relative w-full bg-white border-b border-[#08a4a3]/10 shadow-sm z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-20">
          {/* Logo - Left */}
          <div className="flex-1 flex justify-start">
            <Link href="/" className="flex items-center group">
              <span className="font-extrabold text-xl md:text-2xl lg:text-3xl text-[#272d68]">
                Hire
              </span>
              <span className="font-extrabold text-xl md:text-2xl lg:text-3xl text-[#08a4a3]">
                4
              </span>
              <span className="font-extrabold text-xl md:text-2xl lg:text-3xl text-[#272d68]">
                Free
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links - Center */}
          <div className="hidden md:flex flex-initial justify-center items-center space-x-8 mx-auto">
            <Link
              href="/about"
              className="text-[#272d68]/70 hover:text-[#08a4a3] text-sm font-semibold transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              About
            </Link>
            <Link
              href="/help"
              className="text-[#272d68]/70 hover:text-[#08a4a3] text-sm font-semibold transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              Help
            </Link>
            <Link
              href="/cookies"
              className="text-[#272d68]/70 hover:text-[#08a4a3] text-sm font-semibold transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              Privacy Policy
            </Link>
            <Link
              href="/courses"
              className="text-[#272d68]/70 hover:text-[#08a4a3] text-sm font-semibold transition-all duration-300 hover:scale-105 whitespace-nowrap"
            >
              Courses
            </Link>
          </div>

          {/* Desktop Auth Actions - Right */}
          <div className="hidden md:flex flex-1 justify-end items-center space-x-4">
            <Link
              href="/login"
              className="text-[#272d68]/70 hover:text-[#272d68] text-sm font-semibold transition-all duration-300 hover:scale-105"
            >
              Log In
            </Link>

            {/* Register Dropdown */}
            <div className="relative register-dropdown">
              <button
                onClick={() => setRegisterDropdownOpen(!registerDropdownOpen)}
                className="bg-linear-to-r from-[#272d68] to-[#08a4a3] text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center gap-2"
              >
                Register
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${registerDropdownOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Dropdown Menu */}
              {registerDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-[#08a4a3]/10 overflow-hidden animate-fadeIn">
                  <Link
                    href="/student/register"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#ceeeed]/30 transition-colors group"
                    onClick={() => setRegisterDropdownOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#ceeeed] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <UserPlus className="w-5 h-5 text-[#08a4a3]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#272d68] text-sm">
                        I&apos;m a Candidate
                      </p>
                      <p className="text-xs text-[#272d68]/60">
                        Looking for job opportunities
                      </p>
                    </div>
                  </Link>
                  <div className="border-t border-[#08a4a3]/10"></div>
                  <Link
                    href="/company/register"
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#ceeeed]/30 transition-colors group"
                    onClick={() => setRegisterDropdownOpen(false)}
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#ceeeed] flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Briefcase className="w-5 h-5 text-[#08a4a3]" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#272d68] text-sm">
                        I&apos;m a Recruiter
                      </p>
                      <p className="text-xs text-[#272d68]/60">
                        Looking to hire talent
                      </p>
                    </div>
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-[#ceeeed]/30 transition-colors"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[#272d68]" />
            ) : (
              <Menu className="w-6 h-6 text-[#272d68]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t bg-white border-[#08a4a3]/10 animate-slideDown">
            <div className="flex flex-col space-y-3">
              <Link
                href="/about"
                className="text-[#272d68]/80 hover:text-[#08a4a3] py-2 px-2 text-base font-semibold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/help"
                className="text-[#272d68]/80 hover:text-[#08a4a3] py-2 px-2 text-base font-semibold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Help
              </Link>
              <Link
                href="/cookies"
                className="text-[#272d68]/80 hover:text-[#08a4a3] py-2 px-2 text-base font-semibold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Privacy Policy
              </Link>
              <Link
                href="/courses"
                className="text-[#272d68]/80 hover:text-[#08a4a3] py-2 px-2 text-base font-semibold transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Courses
              </Link>

              <div className="pt-3 mt-2 border-t border-[#08a4a3]/10">
                <Link
                  href="/login"
                  className="text-[#272d68]/80 hover:text-[#272d68] py-2 px-2 text-base font-semibold block transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </Link>

                <div className="mt-2 space-y-2">
                  <Link
                    href="/student/register"
                    className="bg-linear-to-r from-[#272d68] to-[#08a4a3] text-white px-4 py-3 rounded-xl text-center font-semibold block transition-all hover:shadow-lg"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register as Candidate
                  </Link>
                  <Link
                    href="/company/register"
                    className="border-2 border-[#08a4a3] text-[#08a4a3] px-4 py-3 rounded-xl text-center font-semibold block transition-all hover:bg-[#08a4a3] hover:text-white"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register as Recruiter
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </nav>
  );
}
