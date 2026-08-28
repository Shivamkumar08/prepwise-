"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function RoleSelect({
  userId,
  currentRole,
}: {
  userId: string;
  currentRole: string;
}) {
  const [role, setRole] = useState(currentRole);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  async function handleChange(newRole: string) {
    setSaving(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("profiles")
      .update({ role: newRole })
      .eq("id", userId);
    setSaving(false);
    if (!error) {
      setRole(newRole);
      router.refresh();
    }
  }

  return (
    <select
      value={role}
      disabled={saving}
      onChange={(e) => handleChange(e.target.value)}
      className="border border-line rounded-lg px-2 py-1 text-sm bg-white text-ink disabled:opacity-50"
    >
      <option value="free_user">free_user</option>
      <option value="premium_user">premium_user</option>
      <option value="admin">admin</option>
    </select>
  );
}
