"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Briefcase,
  PlusCircle,
  FileText,
  Building2,
  LogOut,
  Menu,
  X,
  ChevronDown,
  UserCheck,
  HelpCircle,
  Cookie,
} from "lucide-react";

// The 5 company navigation routes aligned to your structure
const menuItems = [
  {
    title: "Home",
    href: "/company",
    icon: LayoutDashboard,
  },
  {
    title: "Create Job",
    href: "/company/create-jobs",
    icon: PlusCircle,
  },
  {
    title: "My Jobs",
    href: "/company/jobs",
    icon: Briefcase,
  },
  {
    title: "Applications",
    href: "/company/applications",
    icon: FileText,
  },
  {
    title: "Profile",
    href: "/company/profile",
    icon: Building2,
  },
];

interface CompanyProfile {
  companyName: string;
  logoUrl?: string;
}

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [company, setCompany] = useState<CompanyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Check authentication on mount
  useEffect(() => {
    let isActive = true;

    const fetchCompanyProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.replace("/login");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/profiles/company/me`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );

        if (!isActive) {
          return;
        }

        if (response.ok) {
          const data = await response.json();
          setCompany(data);
        } else if (response.status === 401) {
          // Token expired or invalid
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          router.replace("/login");
        }
      } catch (error) {
        console.error("Failed to fetch company profile:", error);
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchCompanyProfile();

    return () => {
      isActive = false;
    };
  }, [router]);

  useEffect(() => {
    // Close profile dropdown if clicked outside
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    // No confirm dialog - just logout
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/");
  };

  const isActive = (href: string) => {
    return (
      pathname === href || (href !== "/company" && pathname.startsWith(href))
    );
  };

  const getFallbackLetter = () => {
    return company?.companyName
      ? company.companyName.charAt(0).toUpperCase()
      : "C";
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 bg-linear-to-br from-[#ceeeed]/20 to-white">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-[#ceeeed] rounded-full"></div>
          <div className="absolute top-0 left-0 w-16 h-16 border-4 border-[#08a4a3] rounded-full border-t-transparent animate-spin"></div>
        </div>
        <span className="text-[#272d68]/70 text-sm font-semibold animate-pulse">
          Verifying credentials...
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 font-sans antialiased">
      {/* GLOBAL TOP HEADER */}
      <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-[#272d68]/10 bg-white/95 backdrop-blur-md px-4 md:px-6 shrink-0 shadow-sm">
        {/* Left Side: Brand Logo & Mobile Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg border border-gray-100 text-[#272d68] md:hidden hover:bg-gray-50 transition"
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          <Link href="/company" className="flex items-center space-x-2 group">
            <div className="w-8 h-8 bg-linear-to-br from-[#272d68] to-[#08a4a3] rounded-lg flex items-center justify-center transition-all duration-300 group-hover:scale-105">
              <span className="text-white font-black text-lg tracking-tighter">
                H
              </span>
            </div>
            <span className="font-extrabold text-lg bg-linear-to-r from-[#272d68] to-[#08a4a3] bg-clip-text text-transparent tracking-tight hidden sm:block">
              Hire4Free
            </span>
          </Link>
        </div>

        {/* Right Side: Profile Action Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-50 border border-transparent hover:border-gray-100 transition-all"
          >
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#ceeeed] to-[#08a4a3]/20 border border-[#08a4a3]/20 flex items-center justify-center overflow-hidden shrink-0">
              {company?.logoUrl ? (
                <Image
                  src={`${process.env.NEXT_PUBLIC_API_URL}${company.logoUrl}`}
                  alt="Company Logo"
                  width={32}
                  height={32}
                  unoptimized
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                    const parent = e.currentTarget.parentElement;
                    if (parent) {
                      parent.innerHTML = getFallbackLetter();
                      parent.classList.add(
                        "flex",
                        "items-center",
                        "justify-center",
                        "text-[#08a4a3]",
                        "font-black",
                        "text-sm",
                      );
                    }
                  }}
                />
              ) : (
                <span className="text-[#08a4a3] font-black text-sm">
                  {getFallbackLetter()}
                </span>
              )}
            </div>
            <ChevronDown
              className={`w-4 h-4 text-[#272d68]/60 transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>

          {/* Action Dropdown Menu Elements */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 origin-top-right rounded-2xl border border-[#272d68]/10 bg-white p-2 shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              <Link
                href="/company/profile"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-[#272d68]/80 hover:bg-[#ceeeed]/20 rounded-xl hover:text-[#272d68] transition"
              >
                <Building2 className="w-4 h-4 text-[#08a4a3]" /> Edit Profile
              </Link>
              <Link
                href="/refer"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-[#272d68]/80 hover:bg-[#ceeeed]/20 rounded-xl hover:text-[#272d68] transition"
              >
                <UserCheck className="w-4 h-4 text-[#272d68]/40" /> Refer
              </Link>
              <Link
                href="/help"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-[#272d68]/80 hover:bg-[#ceeeed]/20 rounded-xl hover:text-[#272d68] transition"
              >
                <HelpCircle className="w-4 h-4 text-[#272d68]/40" /> Help
              </Link>
              <Link
                href="/cookies"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 text-sm font-semibold text-[#272d68]/80 hover:bg-[#ceeeed]/20 rounded-xl hover:text-[#272d68] transition"
              >
                <Cookie className="w-4 h-4 text-[#272d68]/40" /> Cookies
              </Link>
              <div className="my-1 border-t border-gray-100" />
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition"
              >
                <LogOut className="w-4 h-4 text-rose-500" /> Logout
              </button>
            </div>
          )}
        </div>
      </header>

      {/* CORE FRAME CONTAINER LAYOUT */}
      <div className="flex flex-1 h-full w-full overflow-hidden">
        {/* SLIM DESKTOP SIDEBAR */}
        <aside className="hidden md:flex flex-col w-24 bg-white border-r border-[#272d68]/10 h-full shrink-0 items-center py-6 select-none">
          <nav className="flex flex-col gap-3 w-full px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex flex-col items-center justify-center w-full py-3 rounded-xl gap-1 transition-all group ${
                    active
                      ? "bg-linear-to-br from-[#272d68] to-[#08a4a3] text-white shadow-md"
                      : "text-[#272d68]/50 hover:bg-[#ceeeed]/30 hover:text-[#272d68]"
                  }`}
                >
                  <Icon
                    className={`h-5 w-5 shrink-0 transition-colors ${
                      active
                        ? "text-white"
                        : "text-[#272d68]/40 group-hover:text-[#08a4a3]"
                    }`}
                  />
                  <span className="text-[11px] font-extrabold tracking-tight text-center px-1 leading-none">
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* MOBILE SLIDE DRAWER BACKDROP */}
        {mobileMenuOpen && (
          <div
            className="fixed inset-0 top-16 bg-[#272d68]/20 backdrop-blur-sm z-30 md:hidden transition-opacity"
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* MOBILE SIDEBAR PANEL */}
        <aside
          className={`fixed top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r border-gray-100 transform transition-transform duration-200 ease-in-out md:hidden flex flex-col p-4 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <nav className="space-y-1 w-full flex-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    active
                      ? "bg-linear-to-r from-[#272d68] to-[#08a4a3] text-white"
                      : "text-[#272d68]/60 hover:bg-gray-50"
                  }`}
                >
                  <Icon
                    className={`h-4 w-4 ${active ? "text-white" : "text-[#272d68]/40"}`}
                  />
                  <span>{item.title}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* MAIN INDEPENDENT VIEWPORT CONTENT SCROLL ZONE */}
        <main className="flex-1 overflow-y-auto w-full scroll-smooth bg-linear-to-br from-[#ceeeed]/20 to-white">
          <div className="p-4 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
