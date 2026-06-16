"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { apiFetch } from "@/lib/api";

interface Company {
  id: string;
  companyName: string;
  logoUrl?: string;
  industry?: string;
  website?: string;
  jobsCount: number;
}

interface FeaturedCompaniesResponse {
  companies: Company[];
}

export default function FeaturedCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  // Track images that fail to render on the network level
  const [brokenImages, setBrokenImages] = useState<Record<string, boolean>>({});

  const fetchCompanies = async () => {
    try {
      const data = await apiFetch<FeaturedCompaniesResponse>("/public/featured-companies");
      setCompanies(data.companies || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const load = async () => {
      await fetchCompanies();
    };
    void load();
  }, []);

  const getLogoSrc = (logoUrl: string) => {
    if (!logoUrl) return "";
    if (logoUrl.startsWith("http://") || logoUrl.startsWith("https://")) {
      return logoUrl;
    }

    // Clean trailing/leading duplicate slash injections safely
    const baseUrl = (
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001"
    ).replace(/\/$/, "");
    const cleanPath = logoUrl.startsWith("/") ? logoUrl : `/${logoUrl}`;

    return `${baseUrl}${cleanPath}`;
  };

  if (loading) {
    return (
      <section className="py-20 text-center text-sm font-medium text-[#272d68]/60">
        Loading companies...
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 px-6 bg-linear-to-b from-white to-[#ceeeed]/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-extrabold text-[#272d68]">
            Companies Hiring Now
          </h2>
          <p className="mt-3 text-[#272d68]/70">
            Discover opportunities from verified employers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
          {companies.map((company) => {
            const hasLogo = company.logoUrl && !brokenImages[company.id];
            const logoSrc = hasLogo ? getLogoSrc(company.logoUrl!) : "";

            return (
              <div
                key={company.id}
                className="bg-white rounded-2xl border border-[#272d68]/10 p-5 hover:shadow-xl transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-center mb-4">
                    {hasLogo ? (
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-zinc-100">
                        <Image
                          src={logoSrc}
                          alt={`${company.companyName} logo`}
                          fill
                          sizes="56px"
                          className="object-cover"
                          unoptimized // Helps bypass internal bundle proxying issues during local dev tests
                          onError={() => {
                            setBrokenImages((prev) => ({
                              ...prev,
                              [company.id]: true,
                            }));
                          }}
                        />
                      </div>
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-[#ceeeed]/50 flex items-center justify-center font-bold text-lg text-[#272d68]">
                        {company.companyName
                          ? company.companyName.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                    )}
                  </div>

                  <h3 className="font-bold text-center text-sm text-[#272d68] line-clamp-1">
                    {company.companyName}
                  </h3>

                  {company.industry && (
                    <p className="text-[11px] text-center text-[#272d68]/50 mt-1 line-clamp-1">
                      {company.industry}
                    </p>
                  )}
                </div>

                <div className="mt-4 text-center">
                  <span className="inline-block px-3 py-1 rounded-full bg-[#ceeeed]/40 text-[#08a4a3] text-xs font-bold">
                    {company.jobsCount} Open{" "}
                    {company.jobsCount === 1 ? "Job" : "Jobs"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
