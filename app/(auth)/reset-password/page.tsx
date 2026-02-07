"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to reset password");
      }

      setIsSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 3000);
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
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-xl">
            <i className="ph-bold ph-lightning text-3xl text-white"></i>
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Almost there!
          </h2>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-md mx-auto">
            Set a new password for your account and get back to growing your
            business.
          </p>
        </div>
      </div>

      {/* RIGHT: Reset Password Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white">
              <i className="ph-bold ph-lightning text-lg"></i>
            </div>
            <span className="text-xl font-bold text-slate-900">Biondesk.</span>
          </div>

          {isSuccess ? (
            <>
              <div className="text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="ph-fill ph-check-circle text-4xl text-emerald-500"></i>
                </div>
                <h1 className="text-2xl font-[700] text-slate-900 mb-2">
                  Password reset!
                </h1>
                <p className="text-sm text-slate-500 mb-8">
                  Your password has been reset successfully. Redirecting you to
                  login...
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm font-[500] text-indigo-600 hover:text-indigo-700"
                >
                  <i className="ph ph-arrow-left"></i>
                  Go to sign in
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h1 className="text-2xl font-[700] text-slate-900 mb-2">
                  Reset your password
                </h1>
                <p className="text-sm text-slate-500">
                  Enter your new password below.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                {/* New Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-[600] text-slate-700">
                    New Password
                  </label>
                  <div className="relative">
                    <i className="ph ph-lock-key absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      <i
                        className={`ph ${showPassword ? "ph-eye" : "ph-eye-slash"} text-lg`}
                      ></i>
                    </button>
                  </div>
                  <p className="text-xs text-slate-400">
                    Must be at least 8 characters
                  </p>
                </div>

                {/* Confirm Password */}
                <div className="space-y-1.5">
                  <label className="text-sm font-[600] text-slate-700">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <i className="ph ph-lock-key absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading || !token}
                  className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-[600] shadow-lg shadow-slate-200/50 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Resetting..." : "Reset Password"}
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

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
