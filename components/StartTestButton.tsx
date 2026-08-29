"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function StartTestButton({ mockTestId }: { mockTestId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleStart() {
    setLoading(true);
    setError("");
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    const { data, error: insertError } = await supabase
      .from("test_attempts")
      .insert({ user_id: user.id, mock_test_id: mockTestId })
      .select("id")
      .single();

    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    router.push(`/mock-tests/${mockTestId}/attempt/${data.id}`);
  }

  return (
    <div>
      <button
        onClick={handleStart}
        disabled={loading}
        className="w-full bg-signal text-white py-3 rounded-lg font-medium hover:bg-signalDark transition-colors disabled:opacity-60"
      >
        {loading ? "Starting…" : "Start Test"}
      </button>
      {error && <p className="text-sm text-pen mt-2">{error}</p>}
    </div>
  );
}
