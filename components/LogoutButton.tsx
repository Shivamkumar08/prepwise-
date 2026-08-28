"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="border border-line px-5 py-2 rounded-lg text-sm font-medium text-ink hover:border-ink/30 transition-colors"
    >
      Log out
    </button>
  );
}
