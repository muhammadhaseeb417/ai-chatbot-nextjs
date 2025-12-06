"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });

        if (error) throw error;

        if (data.user) {
          if (data.user.confirmed_at) {
            setMessage("Account created! Redirecting...");
            router.push("/chat");
          } else {
            setMessage("Check your email to verify your account.");
          }
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        if (data.user && !data.user.email_confirmed_at) {
          setMessage("Please verify your email before logging in.");
          await supabase.auth.signOut();
          return;
        }

        setMessage("Logged in successfully!");
        router.push("/chat");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[var(--background)]">
      <div className="w-full max-w-[380px] animate-fade-in">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[var(--primary)] mb-4 shadow-lg">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-[var(--foreground)] mb-2">
            AI Assistant
          </h1>
          <p className="text-sm text-[var(--foreground-muted)]">
            Secure conversations powered by AI
          </p>
        </div>

        <div className="card shadow-soft w-[400px] mx-auto ">
          <div className="mb-6 text-center">
            <h2 className="text-lg font-medium tracking-tight text-[var(--foreground)] mb-1">
              {isSignUp ? "Create account" : "Welcome back"}
            </h2>
            <p className="text-xs text-[var(--foreground-muted)]">
              {isSignUp ? "Enter your details to get started" : "Sign in to continue"}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="space-y-2">
              <label 
                htmlFor="email"
                className="text-xs font-medium text-[var(--foreground-muted)] block"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="name@example.com"
                className="w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            <div className="space-y-2">
              <label 
                htmlFor="password"
                className="text-xs font-medium text-[var(--foreground-muted)] block"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="Enter your password"
                className="w-full"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? "new-password" : "current-password"}
              />
              {isSignUp && (
                <p className="text-xs text-[var(--foreground-subtle)] mt-1">
                  Must be at least 6 characters
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-2.5 mt-6"
            >
              {loading ? (
                <span className="opacity-70">Processing...</span>
              ) : isSignUp ? (
                "Create Account"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {message && (
            <div 
              className={`mt-4 p-3 rounded-lg text-xs text-center border ${
                message.includes("error") || message.includes("verify")
                  ? "bg-red-500/10 border-red-500/30 text-red-400"
                  : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
              }`}
            >
              {message}
            </div>
          )}

          <div className="mt-6 text-center">
            <button
              type="button"
              className="text-xs text-[var(--foreground-muted)] hover:text-[var(--foreground)] transition-colors"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setMessage("");
              }}
            >
              {isSignUp
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-[var(--foreground-subtle)]">
            By continuing, you agree to our Terms & Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
}