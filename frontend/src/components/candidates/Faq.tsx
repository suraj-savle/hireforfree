"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, HelpCircle } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs: FaqItem[] = [
    {
      question: "Is it really 100% free for students?",
      answer:
        "Yes, entirely! There are no hidden fees, subscriptions, or paywalls for student candidates looking for work or utilizing our featured capabilities.",
    },
    {
      question: "How does the 'One click apply' process work?",
      answer:
        "Once you build your core profile including your career goals, experience, and system preferences, your profile acts as your application standard. Click apply on any job card, and your profile is forwarded directly to stakeholders instantly.",
    },
    {
      question: "Can I remain hidden from specific employers?",
      answer:
        "Absolutely. Your dashboard details allow strict visibility adjustments. You control exactly who can view your data or pitch you direct interview scopes.",
    },
    {
      question: "How long does it take to get featured?",
      answer:
        "After applying for the featured program, our team reviews your profile within 2-3 business days. you&apos;ll receive an email notification once your profile is approved and highlighted to recruiters.",
    },
  ];

  return (
    <section className="w-full bg-[#ceeeed]/10 py-16 sm:py-20 md:py-24 px-4 sm:px-6 border-t border-[#272d68]/5">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#08a4a3]/10 rounded-full mb-4 mx-auto">
            <HelpCircle className="w-6 h-6 text-[#08a4a3]" />
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-[#272d68]">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#272d68]/60">
            Everything you need to know about finding your next opportunity
          </p>
        </div>

        {/* FAQ Accordion */}
        <div className="space-y-3 sm:space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-[#272d68]/10 rounded-xl overflow-hidden shadow-sm transition-all duration-300 hover:shadow-md"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between text-[#272d68] font-semibold sm:font-bold hover:bg-gray-50 transition-colors group"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 sm:w-5 sm:h-5 text-[#08a4a3] transition-all duration-300 flex-shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    } group-hover:scale-110`}
                  />
                </button>
                <div
                  className={`transition-all duration-300 ease-in-out ${
                    isOpen
                      ? "max-h-96 opacity-100"
                      : "max-h-0 opacity-0 overflow-hidden"
                  }`}
                >
                  <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-sm sm:text-base text-[#272d68]/80 border-t border-gray-100 pt-3 sm:pt-4 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Support CTA */}
        <div className="mt-10 sm:mt-12 text-center">
          <p className="text-sm text-[#272d68]/60">
            Still have questions?{" "}
            <Link
              href="/contact"
              className="text-[#08a4a3] font-semibold hover:underline"
            >
              Contact our support team
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
