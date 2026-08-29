import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import LogoutButton from "@/components/LogoutButton";

export default async function SiteHeader() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? "free_user";
  }

  return (
    <header className="border-b border-line bg-paper">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-display font-extrabold text-lg text-ink tracking-tight">
          PrepWise
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-ink/70">
          <Link href="/exams" className="hover:text-ink">
            Exams
          </Link>
          <Link href="/resources" className="hover:text-ink">
            Resources
          </Link>
          <Link href="/mock-tests" className="hover:text-ink">
            Mock Tests
          </Link>
        </nav>
        <div className="flex items-center gap-3 text-sm font-medium">
          {user ? (
            <>
              <Link href="/dashboard" className="text-ink/70 hover:text-ink hidden sm:inline truncate max-w-[160px]">
                {user.email}
              </Link>
              {role === "admin" && (
                <Link href="/admin" className="text-ink/70 hover:text-ink hidden sm:inline">
                  Admin
                </Link>
              )}
              <LogoutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="text-ink/70 hover:text-ink hidden sm:inline">
                Log in
              </Link>
              <Link
                href="/signup"
                className="bg-ink text-paper px-4 py-2 rounded-lg hover:bg-ink/90 transition-colors"
              >
                Get free access
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
