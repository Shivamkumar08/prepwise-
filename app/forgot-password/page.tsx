"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center px-6 text-center">
        <div className="max-w-sm">
          <h1 className="font-display font-bold text-2xl text-ink">Check your email</h1>
          <p className="text-ink/60 mt-3">
            If an account exists for {email}, a password reset link is on its way.
          </p>
          <Link href="/login" className="inline-block mt-6 text-signal font-medium text-sm">
            Back to login
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display font-extrabold text-lg text-ink">
          PrepWise
        </Link>
        <h1 className="font-display font-bold text-2xl text-ink mt-6">Reset your password</h1>
        <p className="text-sm text-ink/60 mt-2">
          Enter your email and we&apos;ll send you a link to set a new password.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink/70">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>
          {error && <p className="text-sm text-pen">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-signal text-white py-2.5 rounded-lg font-medium hover:bg-signalDark transition-colors disabled:opacity-60"
          >
            {loading ? "Sending…" : "Send reset link"}
          </button>
        </form>
        <p className="mt-6 text-sm text-ink/60">
          <Link href="/login" className="text-signal font-medium">
            Back to login
          </Link>
        </p>
      </div>
    </main>
  );
}
