"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError(error.message);
      return;
    }
    setDone(true);
    setTimeout(() => router.push("/dashboard"), 1500);
  }

  if (done) {
    return (
      <main className="min-h-screen bg-paper flex items-center justify-center px-6 text-center">
        <div className="max-w-sm">
          <h1 className="font-display font-bold text-2xl text-ink">Password updated</h1>
          <p className="text-ink/60 mt-3">Taking you to your dashboard…</p>
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
        <h1 className="font-display font-bold text-2xl text-ink mt-6">Set a new password</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-ink/70">New password</label>
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
            {loading ? "Updating…" : "Update password"}
          </button>
        </form>
      </div>
    </main>
  );
}
