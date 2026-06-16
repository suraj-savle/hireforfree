"use client";
import Navbar from "@/components/candidates/Navbar";

export default function SupportPage() {
  const faqs = [
    {
      q: "Is Hire4Free truly free for companies?",
      a: "Yes. Hire4Free doesn't enforce standard premium or agency broker subscription schemas. Businesses can post unlimited vacancies and review matching portfolios entirely free.",
    },
    {
      q: "How do you protect candidate profile data?",
      a: "We apply multi-factor workspace security protocols. Only active, verified companies can download configuration indices or contact profiles directly.",
    },
    {
      q: "Can I manage multiple applications simultaneously?",
      a: "Absolutely. Your tailored candidate dashboard lets you look over, track, and interact with all status updates end-to-end dynamically.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between relative">
      {/* Floating Back Button */}

      <Navbar />

      {/* Hero Header */}
      <section className="w-full bg-linear-to-br from-[#272d68] via-[#1e3d64] to-[#08a4a3] py-24 px-6 text-center text-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-4 relative z-10">
          <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-[#ceeeed]">
            Help Desk Center
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight">
            How can we support you today?
          </h1>
          <p className="text-[#ceeeed]/80 text-sm font-medium max-w-lg mx-auto">
            Get instant solutions to credential validations, corporate
            configuration updates, or candidate dashboard metrics.
          </p>
        </div>
      </section>

      {/* Main Layout Area */}
      <section className="max-w-5xl mx-auto px-6 py-16 w-full  gap-10 items-center">
        {/* Right Hand: FAQ Accordions */}
        <div className="md:col-span-5 space-y-6">
          <h2 className="text-xl font-extrabold text-[#272d68]">
            Common Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="bg-white border border-[#272d68]/5 shadow-sm p-5 rounded-2xl space-y-2"
              >
                <h3 className="font-bold text-sm text-[#272d68]">{faq.q}</h3>
                <p className="text-xs font-medium text-[#272d68]/60 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>

          <div className="p-6 bg-[#272d68]/5 rounded-2xl border border-[#272d68]/5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#272d68]/70">
              Urgent Escalations
            </h4>
            <p className="text-xs font-medium text-[#272d68]/60 leading-relaxed">
              For security reports or enterprise governance inquiries, email our
              support handlers at{" "}
              <span className="text-[#08a4a3] font-bold">
                support@hire4free.com
              </span>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Corporate Footprint Info */}
      <footer className="text-center py-10 text-xs font-medium text-[#272d68]/40 border-t border-[#272d68]/5">
        Managed under corporate supervision by Shunya Tattva Management
        Consultants.
      </footer>
    </div>
  );
}
