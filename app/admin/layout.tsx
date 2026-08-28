import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-paper flex">
      <aside className="w-56 border-r border-line bg-white flex flex-col">
        <div className="px-5 py-5 border-b border-line">
          <Link href="/" className="font-display font-extrabold text-ink">
            PrepWise
          </Link>
          <p className="text-xs text-ink/40 mt-0.5">Admin</p>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1 text-sm">
          <Link
            href="/admin"
            className="block px-3 py-2 rounded-lg text-ink/70 hover:bg-paper hover:text-ink font-medium"
          >
            Overview
          </Link>
          <Link
            href="/admin/users"
            className="block px-3 py-2 rounded-lg text-ink/70 hover:bg-paper hover:text-ink font-medium"
          >
            Users
          </Link>
          <p className="px-3 pt-4 text-xs text-ink/30 uppercase tracking-widest">
            Coming in Phase 6
          </p>
          <span className="block px-3 py-2 rounded-lg text-ink/30 font-medium cursor-not-allowed">
            Content
          </span>
          <span className="block px-3 py-2 rounded-lg text-ink/30 font-medium cursor-not-allowed">
            Mock Tests
          </span>
        </nav>
        <div className="px-3 py-4 border-t border-line">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
