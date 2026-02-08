"use client";

import { useState } from "react";
import Link from "next/link";
import Turnstile from "@/components/Turnstile";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [turnstileToken, setTurnstileToken] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, turnstileToken }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to send reset email");
      }

      setIsSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white font-sans antialiased h-screen flex overflow-hidden">
      {/* LEFT: Visual & Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-slate-900 z-10"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[150px] opacity-20"></div>

        {/* Content */}
        <div className="relative z-20 text-center px-12">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-xl overflow-hidden">
            <img
              src="/logo-square.png"
              alt="Biondesk"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Don&apos;t worry,
            <br />
            we&apos;ve got you.
          </h2>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-md mx-auto">
            Just enter your email and we&apos;ll send you a link to reset your
            password.
          </p>
        </div>
      </div>

      {/* RIGHT: Forgot Password Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white overflow-hidden">
              <img
                src="/logo-square.png"
                alt="Biondesk"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold text-slate-900">Biondesk.</span>
          </div>

          {isSuccess ? (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <img
                    src="/logo-square.png"
                    alt="Biondesk"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h1 className="text-2xl font-[700] text-slate-900 mb-2">
                  Check your email
                </h1>
                <p className="text-sm text-slate-500 mb-8">
                  We&apos;ve sent a password reset link to{" "}
                  <strong>{email}</strong>
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-[500] text-indigo-600 hover:text-indigo-700"
                >
                  <i className="ph ph-arrow-left"></i>
                  Back to sign in
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-[700] text-slate-900 mb-2">
                  Forgot password?
                </h1>
                <p className="text-sm text-slate-500">
                  Enter your email address and we&apos;ll send you a reset link.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="text-sm font-[600] text-slate-700">
                    Email
                  </label>
                  <div className="relative">
                    <i className="ph ph-envelope-simple absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>



                {/* Turnstile */}
                <div className="flex justify-center">
                  <Turnstile
                    siteKey={process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || ""}
                    onVerify={(token) => setTurnstileToken(token)}
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-[600] shadow-lg shadow-slate-200/50 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Sending..." : "Send Reset Link"}
                </button>
              </form>

              <p className="text-center text-xs text-slate-400 mt-8">
                <Link
                  href="/login"
                  className="text-indigo-600 font-[600] hover:underline inline-flex items-center gap-1"
                >
                  <i className="ph ph-arrow-left"></i>
                  Back to sign in
                </Link>
              </p>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-6 text-center w-full">
          <p className="text-[10px] text-slate-300">
            © 2026 Biondesk. Crafted for growth.
          </p>
        </div>
      </div>
    </div>
  );
}
