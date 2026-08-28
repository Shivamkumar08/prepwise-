"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link href="/" className="font-display font-extrabold text-lg text-ink">
          PrepWise
        </Link>
        <h1 className="font-display font-bold text-2xl text-ink mt-6">
          Log in
        </h1>
        <form onSubmit={handleLogin} className="mt-6 space-y-4">
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>
          {error && <p className="text-sm text-pen">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-signal text-white py-2.5 rounded-lg font-medium hover:bg-signalDark transition-colors disabled:opacity-60"
          >
            {loading ? "Logging in…" : "Log in"}
          </button>
        </form>
        <p className="mt-6 text-sm text-ink/60">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="text-signal font-medium">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
