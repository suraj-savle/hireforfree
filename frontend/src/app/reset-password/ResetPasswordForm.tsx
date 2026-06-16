"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  Loader2,
  Lock,
  ShieldCheck,
  CheckCircle2,
  Eye,
  EyeOff,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email = searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // State for toggling password field visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    try {
      setLoading(true);

      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.message || "Invalid token execution validation parameters.",
        );
      }

      setSuccessMsg("Password updated successfully! Redirecting to login...");

      setTimeout(() => {
        router.push("/login");
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
            Hire4Free
          </Link>
        </div>

        <div className="relative z-10 max-w-md space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Establish your identity parameters safely.
          </h2>
          <p className="text-[#ceeeed]/80 font-medium text-base">
            Input the security authorization sequence from your email container
            along with your new key configurations.
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
            <h1 className="text-2xl font-extrabold text-[#272d68] tracking-tight">
              Update Password
            </h1>
            <p className="mt-1.5 text-sm font-medium text-[#272d68]/60">
              Confirm authorization parameters for{" "}
              <span className="text-[#08a4a3] font-bold">
                {email || "your account"}
              </span>
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
            {/* OTP Input */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#272d68]/60">
                Security Token OTP
              </label>
              <div className="mt-1 relative">
                <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#272d68]/30" />
                <input
                  type="text"
                  required
                  placeholder="Enter 6-Digit Code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full rounded-xl border border-[#272d68]/10 bg-gray-50/50 pl-10 pr-4 py-3 text-sm text-[#272d68] font-semibold placeholder-[#272d68]/30 outline-none focus:border-[#08a4a3]/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* New Password Input */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#272d68]/60">
                New Secure Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#272d68]/30" />
                <input
                  // Toggles input interpretation dynamically
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-[#272d68]/10 bg-gray-50/50 pl-10 pr-12 py-3 text-sm text-[#272d68] outline-none focus:border-[#08a4a3]/50 focus:bg-white transition-all font-semibold"
                />
                {/* Visibility Trigger Button */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#272d68]/40 hover:text-[#272d68] transition-colors rounded-md"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full rounded-xl bg-[#272d68] hover:bg-[#1f2454] py-3 text-sm font-bold text-white shadow-sm transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Committing Changes...</span>
                </>
              ) : (
                "Update Credentials"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
