"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { apiFetch } from "@/lib/api";
import { AlertCircle, Loader2, Mail, Lock, CheckCircle2, Eye, EyeOff } from "lucide-react";

type LoginResponse = {
  access_token?: string;
  accessToken?: string;
  user?: {
    id: string;
    email: string;
    role: string;
  };
};

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // State for toggling visibility
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.email || !form.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const res = (await apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(form),
      })) as LoginResponse;

      const token = res.access_token ?? res.accessToken;

      if (token && res.user) {
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(res.user));

        if (res.user.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (res.user.role === "STUDENT") {
          router.push("/student");
        } else if (res.user.role === "COMPANY") {
          router.push("/company");
        } else {
          router.push("/");
        }
      } else {
        throw new Error("Invalid email or password credentials.");
      }
    } catch (err: unknown) {
      console.error(err);
      const message =
        err instanceof Error ? err.message : "Authentication failed.";
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

        <div className="relative z-10 max-w-md space-y-6">
          <h2 className="text-4xl font-extrabold tracking-tight text-white leading-tight">
            Connecting direct talent without margins.
          </h2>
          <p className="text-[#ceeeed]/80 font-medium text-base">
            Skip the middleman. Apply directly to leading employers and manage
            your growth metrics transparently.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3 text-sm text-white font-semibold">
              <CheckCircle2 className="w-5 h-5 text-[#08a4a3] bg-white rounded-full" />
              <span>Direct communication with companies</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-white font-semibold">
              <CheckCircle2 className="w-5 h-5 text-[#08a4a3] bg-white rounded-full" />
              <span>100% Free platform mapping tools</span>
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

          <h1 className="text-2xl font-extrabold text-[#272d68] tracking-tight">
            Welcome Back 👋
          </h1>
          <p className="mt-1.5 text-sm font-medium text-[#272d68]/60">
            Login to access your personalized workspace dashboard.
          </p>

          {error && (
            <div className="mt-5 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-xs font-bold text-rose-700">
              <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Email Form Field */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#272d68]/60">
                Email Address
              </label>
              <div className="mt-1 relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#272d68]/30" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="name@company.com"
                  className="w-full rounded-xl border border-[#272d68]/10 bg-gray-50/50 pl-10 pr-4 py-3 text-sm text-[#272d68] font-semibold placeholder-[#272d68]/30 outline-none focus:border-[#08a4a3]/50 focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Password Form Field */}
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-[#272d68]/60">
                Secure Password
              </label>
              <div className="mt-1 relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-[#272d68]/30" />
                <input
                  name="password"
                  // Dynamically changes between password masking and plain text
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full rounded-xl border border-[#272d68]/10 bg-gray-50/50 pl-10 pr-12 py-3 text-sm text-[#272d68] outline-none focus:border-[#08a4a3]/50 focus:bg-white transition-all font-semibold"
                />
                {/* Visibility Toggle Trigger */}
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

            <nav className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-[#08a4a3] hover:text-[#068c8b] transition"
              >
                Forgot Password?
              </Link>
            </nav>

            {/* Submit Action Control */}
            <button
              disabled={loading}
              className="w-full rounded-xl bg-[#08a4a3] hover:bg-[#068c8b] py-3 text-sm font-bold text-white shadow-sm shadow-[#08a4a3]/10 transition-all active:scale-[0.99] disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs font-semibold text-[#272d68]/50">
            Don’t have an account yet?{" "}
            <Link
              href="/student/register"
              className="text-[#08a4a3] hover:text-[#068c8b] font-bold underline underline-offset-2"
            >
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}