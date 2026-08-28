import { redirect } from "next/navigation";
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

  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <h1 className="font-display font-bold text-2xl text-ink">
          Welcome back
        </h1>
        <p className="text-ink/60 mt-2">{user.email}</p>
        <p className="text-sm text-ink/40 mt-4">
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
