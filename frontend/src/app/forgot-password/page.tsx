"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  AlertCircle,
  Loader2,
  Mail,
  CheckCircle2,
  ArrowLeft,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to initiate password reset.");
      }

      setSuccessMsg("Security code sent successfully! Redirecting...");

      setTimeout(() => {
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* LEFT PANEL: Premium Brand Graphic Panel */}
      <div className="hidden lg:flex w-1/2 bg-linear-to-br from-[#272d68] via-[#1e3d64] to-[#08a4a3] p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-96 h-96 bg-[#ceeeed]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <Link
            href="/"
            className="text-2xl font-extrabold text-white tracking-tight"
          >
            <span className="font-extrabold text-xl md:text-3xl text-[#d0d0d0]">
              Hire
            </span>
            <span className="font-extrabold text-xl md:text-3xl text-[#08a4a3]">
              4
            </span>
            <span className="font-extrabold text-xl md:text-3xl text-[#d0d0d0]">
              Free
            </span>
          </Link>
        </div>

        <div className="relative z-10 max-w-md space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Protect your profile credentials securely.
          </h2>
          <p className="text-[#ceeeed]/80 font-medium text-base">
            Provide your registered account email address to request a
            multi-factor verification token sequence.
          </p>
        </div>

        <div className="relative z-10 text-xs font-semibold text-[#ceeeed]/40">
          © {new Date().getFullYear()} Hire4Free Systems. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL: Form Workspace */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#272d68]/10 p-8 shadow-sm">
          <div className="lg:hidden mb-8">
            <span className="text-xl font-extrabold text-[#272d68] tracking-tight">
              Hire4Free
            </span>
          </div>

          <div className="mb-6">
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-xs font-bold text-[#08a4a3] hover:text-[#068c8b] transition mb-4"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
            <h1 className="text-2xl font-extrabold text-[#272d68] tracking-tight">
              Recover Password
            </h1>
            <p className="mt-1.5 text-sm font-medium text-[#272d68]/60">
              Enter your email to receive a secure authorization reset token.
            </p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-[#ceeeed]/60 bg-[#ceeeed]/20 p-4 text-xs font-bold text-[#08a4a3]">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-[#08a4a3]" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#272d68]/60">
                Email Address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#272d68]/30" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-[#272d68]/10 bg-gray-50/50 pl-10 pr-4 py-3 text-sm text-[#272d68] font-semibold placeholder-[#272d68]/30 outline-none focus:border-[#08a4a3]/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full rounded-xl bg-[#08a4a3] hover:bg-[#068c8b] py-3 text-sm font-bold text-white shadow-sm transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 pt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Code...</span>
                </>
              ) : (
                "Send Reset OTP"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
