"use client";

import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import FeaturedCompanies from "@/components/FeaturedCompanies";
import TalentSection from "@/components/TalentSection";
import CTASection from "@/components/CTASection";
import Footer from "@/components/Footer";

export default function HireMeLandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <Navigation isScrolled={isScrolled} />
      <HeroSection />
      <FeaturedCompanies />
      <TalentSection />
      <CTASection />
      <Footer />
    </div>
  );
}