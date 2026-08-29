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
    <div className="min-h-screen bg-paper flex flex-col md:flex-row">
      <aside className="w-full md:w-56 border-b md:border-b-0 md:border-r border-line bg-white">
        <div className="px-5 py-4 flex items-center justify-between md:block">
          <div>
            <Link href="/" className="font-display font-extrabold text-ink">
              PrepWise
            </Link>
            <p className="text-xs text-ink/40 mt-0.5">Admin</p>
          </div>
          <div className="md:hidden">
            <LogoutButton />
          </div>
        </div>
        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible px-3 pb-3 md:pb-4 md:pt-1 gap-1 md:gap-0 md:space-y-1 text-sm border-t md:border-t-0 border-line">
          <Link
            href="/admin"
            className="flex-shrink-0 whitespace-nowrap px-3 py-2 rounded-lg text-ink/70 hover:bg-paper hover:text-ink font-medium"
          >
            Overview
          </Link>
          <Link
            href="/admin/users"
            className="flex-shrink-0 whitespace-nowrap px-3 py-2 rounded-lg text-ink/70 hover:bg-paper hover:text-ink font-medium"
          >
            Users
          </Link>
          <Link
            href="/admin/content"
            className="flex-shrink-0 whitespace-nowrap px-3 py-2 rounded-lg text-ink/70 hover:bg-paper hover:text-ink font-medium"
          >
            Content
          </Link>
          <Link
            href="/admin/mock-tests"
            className="flex-shrink-0 whitespace-nowrap px-3 py-2 rounded-lg text-ink/70 hover:bg-paper hover:text-ink font-medium"
          >
            Mock Tests
          </Link>
        </nav>
        <div className="hidden md:block px-3 py-4 border-t border-line">
          <LogoutButton />
        </div>
      </aside>
      <main className="flex-1 p-4 md:p-8 overflow-x-hidden">{children}</main>
    </div>
  );
}
