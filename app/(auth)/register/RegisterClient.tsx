"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterClient() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Registration failed");
      }

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    window.location.href = "/api/auth/google";
  };

  return (
    <div className="bg-white font-sans antialiased h-screen flex overflow-hidden">
      {/* ... (Visual & Branding remains same) ... */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative items-center justify-center overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/50 to-slate-900 z-10"></div>
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-600 rounded-full blur-[120px] opacity-40"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-500 rounded-full blur-[150px] opacity-20"></div>

        {/* Content */}
        <div className="relative z-20 text-center px-12">
          <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-8 border border-white/20 shadow-xl overflow-hidden">
            <img
              src="/logo.png"
              alt="Biondesk"
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4 tracking-tight">
            Start closing deals
            <br />
            faster, today.
          </h2>
          <p className="text-indigo-200 text-lg leading-relaxed max-w-md mx-auto">
            Join thousands of freelancers and studios who use Biondesk to manage
            their client work with ease.
          </p>

          {/* Features List */}
          <div className="mt-12 space-y-4 text-left max-w-sm mx-auto">
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <i className="ph-fill ph-check-circle text-emerald-400"></i>
              </div>
              <span className="text-sm">AI-powered proposal generator</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <i className="ph-fill ph-check-circle text-emerald-400"></i>
              </div>
              <span className="text-sm">Beautiful quotes & invoices</span>
            </div>
            <div className="flex items-center gap-3 text-white/90">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <i className="ph-fill ph-check-circle text-emerald-400"></i>
              </div>
              <span className="text-sm">Automated follow-up reminders</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT: Register Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-12 relative">
        <div className="w-full max-w-sm animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden mb-8 flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white overflow-hidden">
              <img
                src="/logo.png"
                alt="Biondesk"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold text-slate-900">Biondesk.</span>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-[700] text-slate-900 mb-2">
              Create your account
            </h1>
            <p className="text-sm text-slate-500">
              Start your 14-day free trial. No credit card required.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Name */}
            <div className="space-y-1.5">
              <label className="text-sm font-[600] text-slate-700">
                Full Name
              </label>
              <div className="relative">
                <i className="ph ph-user absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-sm font-[600] text-slate-700">Email</label>
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

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-sm font-[600] text-slate-700">
                Password
              </label>
              <div className="relative">
                <i className="ph ph-lock-key absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-lg"></i>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
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

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-[600] shadow-lg shadow-slate-200/50 transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-400 font-medium tracking-wide">
                Or continue with
              </span>
            </div>
          </div>

          {/* Social Login */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-sm font-[600] flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Google
          </button>

          <p className="text-center text-xs text-slate-400 mt-8">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-600 font-[600] hover:underline"
            >
              Sign in
            </Link>
          </p>

          <p className="text-center text-[10px] text-slate-300 mt-4">
            By signing up, you agree to our{" "}
            <Link href="#" className="underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline">
              Privacy Policy
            </Link>
          </p>
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
