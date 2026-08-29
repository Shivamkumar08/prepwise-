import { redirect } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
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

  const { data: attempts } = await supabase
    .from("test_attempts")
    .select("id, mock_test_id, score, correct_count, wrong_count, unattempted_count, submitted_at, mock_tests(title, total_marks)")
    .eq("user_id", user.id)
    .not("submitted_at", "is", null)
    .order("submitted_at", { ascending: false })
    .limit(20);

  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="px-6 py-16">
      <div className="max-w-2xl mx-auto">
        <div className="text-center">
          <h1 className="font-display font-bold text-2xl text-ink">Welcome back</h1>
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
            </div>
          )}

          <div className="mt-6">
            <LogoutButton />
          </div>
        </div>

        <h2 className="font-display font-bold text-xl text-ink mt-14">Test History</h2>
        <div className="mt-6 space-y-3">
          {(attempts ?? []).length === 0 && (
            <p className="text-sm text-ink/40 border border-dashed border-line rounded-xl p-6 text-center">
              You haven't completed any mock tests yet.
            </p>
          )}
          {(attempts ?? []).map((a: any) => {
            const test = Array.isArray(a.mock_tests) ? a.mock_tests[0] : a.mock_tests;
            const attempted = (a.correct_count ?? 0) + (a.wrong_count ?? 0);
            const accuracy = attempted > 0 ? Math.round(((a.correct_count ?? 0) / attempted) * 100) : 0;
            return (
              <Link
                key={a.id}
                href={`/mock-tests/${a.mock_test_id}/attempt/${a.id}/result`}
                className="flex items-center justify-between border border-line bg-white rounded-xl px-5 py-4 hover:border-signal/40 hover:shadow-sm transition-all"
              >
                <div>
                  <p className="font-display font-bold text-ink">{test?.title}</p>
                  <p className="text-xs text-ink/40 mt-1">
                    {new Date(a.submitted_at).toLocaleDateString()} · {accuracy}% accuracy
                  </p>
                </div>
                <p className="font-display font-bold text-ink">
                  {a.score} / {test?.total_marks}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
      </div>
    </main>
  );
}
