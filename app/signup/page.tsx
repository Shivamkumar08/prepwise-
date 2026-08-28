"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
  }

  if (done) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center px-6 text-center">
        <div className="max-w-sm">
          <h1 className="font-display font-bold text-2xl text-ink">
            Account created
          </h1>
          <p className="text-ink/60 mt-3">
            You can log in now.
          </p>
          <Link
            href="/login"
            className="inline-block mt-6 bg-signal text-white px-6 py-2.5 rounded-lg font-medium hover:bg-signalDark transition-colors"
          >
            Go to login
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
        <h1 className="font-display font-bold text-2xl text-ink mt-6">
          Create your account
        </h1>
        <form onSubmit={handleSignup} className="mt-6 space-y-4">
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
          <div>
            <label className="text-sm font-medium text-ink/70">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
            <p className="text-xs text-ink/40 mt-1">At least 6 characters.</p>
          </div>
          {error && <p className="text-sm text-pen">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-signal text-white py-2.5 rounded-lg font-medium hover:bg-signalDark transition-colors disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Sign up"}
          </button>
        </form>
        <p className="mt-6 text-sm text-ink/60">
          Already have an account?{" "}
          <Link href="/login" className="text-signal font-medium">
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}
