"use client";

import React, { useState } from "react";
import Link from "next/link";
import { authActions } from "@/services/auth.service";
import {
  AlertCircle,
  Loader2,
  Mail,
  Lock,
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";

interface RegisterFormProps {
  role: "STUDENT" | "COMPANY";
}

export default function RegisterForm({ role }: RegisterFormProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // States for toggling individual password inputs visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await authActions.sendOtp(email);
      setSuccessMsg("An OTP code has been dispatched to your email address.");
      setStep(2);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Failed to send verification code.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);
    try {
      await authActions.verifyOtp(email, otp);
      setSuccessMsg("Email verification completed successfully!");
      setStep(3);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Invalid or expired OTP token.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const data = await authActions.register({ email, password, role });
      setSuccessMsg(
        "Account successfully registered! Redirecting to workspace...",
      );

      if (data?.access_token) {
        localStorage.setItem("token", data.access_token);
      }

      setTimeout(() => {
        if (role === "STUDENT") {
          window.location.href = "/student/profile";
        } else {
          window.location.href = "/company/profile";
        }
      }, 1500);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* LEFT PANEL: Premium Brand Graphic Panel (Visible on Desktop) */}
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

        <div className="relative z-10 max-w-md space-y-6">
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Empowering the next generation of top talent.
          </h2>
          <p className="text-[#ceeeed]/80 font-medium text-base">
            Create your zero-margin gateway account. Complete secure email
            multi-factor authorization to claim your workspace.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm text-white font-semibold">
              <CheckCircle2 className="w-5 h-5 text-[#08a4a3] bg-white rounded-full shrink-0" />
              <span>Verified profiles securely tied to identity</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white font-semibold">
              <CheckCircle2 className="w-5 h-5 text-[#08a4a3] bg-white rounded-full shrink-0" />
              <span>Instant access setup after email matching</span>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-xs font-semibold text-[#ceeeed]/40">
          © {new Date().getFullYear()} Hire4Free Systems. All rights reserved.
        </div>
      </div>

      {/* RIGHT PANEL: Dynamic Form Workspace */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#272d68]/10 p-8 shadow-sm">
          <div className="lg:hidden mb-8">
            <span className="font-extrabold text-xl md:text-3xl text-[#272d68]">
              Hire
            </span>
            <span className="font-extrabold text-xl md:text-3xl text-[#08a4a3]">
              4
            </span>
            <span className="font-extrabold text-xl md:text-3xl text-[#272d68]">
              Free
            </span>
          </div>

          {/* Stepper Header Back Controls */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-extrabold text-[#272d68] tracking-tight capitalize">
                Join as {role.toLowerCase()}
              </h1>
              <p className="mt-1 text-xs font-medium text-[#272d68]/60">
                {step === 1 &&
                  "Step 1: Request account activation security token"}
                {step === 2 &&
                  "Step 2: Confirm identity security verification token"}
                {step === 3 && "Step 3: Establish your secure credentials"}
              </p>
            </div>
            {step > 1 && (
              <button
                onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
                className="p-2 text-[#272d68]/50 hover:text-[#272d68] hover:bg-slate-50 rounded-xl transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Core Pipeline Status Indicators */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  step === num
                    ? "bg-[#08a4a3]"
                    : step > num
                      ? "bg-[#272d68]/80"
                      : "bg-slate-100"
                }`}
              />
            ))}
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

          {/* STEP 1: Send Verification Token */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#272d68]/60">
                  Email Address
                </label>
                <div className="mt-1 relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#272d68]/30" />
                  <input
                    type="email"
                    required
                    placeholder="name@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-[#272d68]/10 bg-gray-50/50 pl-10 pr-4 py-3 text-sm text-[#272d68] font-semibold placeholder-[#272d68]/30 outline-none focus:border-[#08a4a3]/50 focus:bg-white transition-all"
                  />
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
                    <span>Sending Token...</span>
                  </>
                ) : (
                  "Send Verification Code"
                )}
              </button>
            </form>
          )}

          {/* STEP 2: Verify Active Security Token */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#272d68]/60 text-center block">
                  6-Digit Verification OTP
                </label>
                <div className="mt-1 relative">
                  <ShieldCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#272d68]/30" />
                  <input
                    type="text"
                    required
                    maxLength={6}
                    placeholder="••••••"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full rounded-xl border border-[#272d68]/10 bg-gray-50/50 text-center font-bold text-lg tracking-[0.35em] pl-10 pr-4 py-3 text-[#272d68] outline-none focus:border-[#08a4a3]/50 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <button
                disabled={loading}
                type="submit"
                className="w-full rounded-xl bg-[#08a4a3] hover:bg-[#068c8b] py-3 text-sm font-bold text-white shadow-sm transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  "Verify OTP Code"
                )}
              </button>
            </form>
          )}

          {/* STEP 3: Complete Password Assignment */}
          {step === 3 && (
            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#272d68]/60">
                  Secure Password
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#272d68]/30" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-[#272d68]/10 bg-gray-50/50 pl-10 pr-12 py-3 text-sm text-[#272d68] outline-none focus:border-[#08a4a3]/50 focus:bg-white transition-all font-semibold"
                  />
                  {/* Password Visibility Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#272d68]/40 hover:text-[#272d68] transition-colors rounded-md"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#272d68]/60">
                  Confirm Password
                </label>
                <div className="mt-1 relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#272d68]/30" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-xl border border-[#272d68]/10 bg-gray-50/50 pl-10 pr-12 py-3 text-sm text-[#272d68] outline-none focus:border-[#08a4a3]/50 focus:bg-white transition-all font-semibold"
                  />
                  {/* Confirm Password Visibility Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-[#272d68]/40 hover:text-[#272d68] transition-colors rounded-md"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
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
                className="w-full rounded-xl bg-[#08a4a3] hover:bg-[#068c8b] py-3 text-sm font-bold text-white shadow-sm transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Finalizing Account...</span>
                  </>
                ) : (
                  "Complete Registration"
                )}
              </button>
            </form>
          )}

          <p className="mt-8 text-center text-xs font-semibold text-[#272d68]/50">
            Already have an operating account?{" "}
            <Link
              href="/login"
              className="text-[#08a4a3] hover:text-[#068c8b] font-bold underline underline-offset-2"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
