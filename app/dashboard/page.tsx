import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, email")
    .eq("id", user.id)
    .single();

  const role = profile?.role ?? "unknown";

  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display font-bold text-2xl text-ink">
          Welcome back
        </h1>
        <p className="text-ink/60 mt-2">{user.email}</p>

        <span
          className={`inline-block mt-4 text-xs font-medium px-3 py-1 rounded-full ${
            role === "admin"
              ? "bg-pen/10 text-pen"
              : role === "premium_user"
              ? "bg-marked/10 text-marked"
              : "bg-correct/10 text-correct"
          }`}
        >
          Role: {role}
        </span>

        {role === "admin" && (
          <div className="mt-6">
            <Link
              href="/admin"
              className="inline-block bg-ink text-paper px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-ink/90 transition-colors"
            >
              Go to Admin Dashboard →
            </Link>
            <p className="text-xs text-ink/40 mt-2">
              (Not built yet — that's Phase 5, next.)
            </p>
          </div>
        )}

        <p className="text-sm text-ink/40 mt-6">
          This is a placeholder dashboard — your real profile, test history
          and saved resources will appear here in later phases.
        </p>
        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </main>
  );
}
