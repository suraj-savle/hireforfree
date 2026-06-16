"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import { Lock, Mail, ShieldAlert } from "lucide-react";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      type LoginResponse = {
        access_token: string;
        user: string;
      };

      const res = (await apiFetch("/auth/login")) as LoginResponse;

      localStorage.setItem("token", res.access_token);
      localStorage.setItem("user", JSON.stringify(res.user));

      router.push("/admin/dashboard");
    } catch (error) {
      console.error(error);
      alert("Login failed: Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-[#272e6830] via-[#ceeeed] to-[#272e6830] px-6 py-12 relative overflow-hidden">
      {/* Decorative background ambient blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 rounded-full bg-[#08a4a3] opacity-20 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 rounded-full bg-[#272d68] opacity-10 blur-3xl pointer-events-none" />

      {/* Login Box with top-down linear scaling */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-md rounded-3xl bg-linear-to-b from-[#ceeeed]/50 via-white to-white p-8 md:p-10 shadow-2xl border border-gray-400"
      >
        {/* Header Block */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#272e6830] text-white shadow-md">
            <ShieldAlert className="h-7 w-7 text-[#ceeeed]" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#272d68] tracking-tight">
            Signing for Admin Dashboard
          </h1>
          <p className="text-xs font-medium text-[#272d68]/60 mt-1">
            Authorized administrative access credentials required
          </p>
        </div>

        {/* Input Fields */}
        <div className="space-y-5">
          {/* Email Field with Icon */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#272d68]/70 mb-1.5 ml-1">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 h-5 w-5 text-[#272d68]/40 pointer-events-none" />
              <input
                type="email"
                placeholder="admin@free4you.com"
                className="w-full rounded-xl border border-[#272d68]/10 bg-white/80 py-3.5 pl-12 pr-4 text-sm text-[#272d68] placeholder-[#272d68]/40 outline-none transition-all shadow-sm focus:border-[#08a4a3] focus:ring-4 focus:ring-[#08a4a3]/10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password Field with Icon */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#272d68]/70 mb-1.5 ml-1">
              Password
            </label>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 h-5 w-5 text-[#272d68]/40 pointer-events-none" />
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#272d68]/10 bg-white/80 py-3.5 pl-12 pr-4 text-sm text-[#272d68] placeholder-[#272d68]/40 outline-none transition-all shadow-sm focus:border-[#08a4a3] focus:ring-4 focus:ring-[#08a4a3]/10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Action Button Sign */}
        <button
          disabled={loading}
          className="mt-8 w-full rounded-xl bg-[#272d68] py-4 text-sm font-bold text-white shadow-lg shadow-[#272d68]/20 transition-all hover:bg-[#1f2352] hover:shadow-xl hover:shadow-[#272d68]/30 active:scale-[0.99] disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading ? "Verifying Session..." : "Sign In to Dashboard"}
        </button>

        {/* Return link */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => router.push("/")}
            className="text-xs font-semibold text-[#08a4a3] hover:underline transition-colors"
          >
            &larr; Return to main portal
          </button>
        </div>
      </form>
    </div>
  );
}
