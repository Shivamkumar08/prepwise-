import { createClient } from "@/lib/supabase/server";

export default async function AdminOverviewPage() {
  const supabase = await createClient();

  const [
    { count: userCount },
    { count: premiumCount },
    { count: resourceCount },
    { count: mockTestCount },
    { count: attemptCount },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "premium_user"),
    supabase.from("resources").select("*", { count: "exact", head: true }),
    supabase.from("mock_tests").select("*", { count: "exact", head: true }),
    supabase.from("test_attempts").select("*", { count: "exact", head: true }),
  ]);

  const stats = [
    { label: "Total Users", value: userCount ?? 0 },
    { label: "Premium Users", value: premiumCount ?? 0 },
    { label: "Resources", value: resourceCount ?? 0 },
    { label: "Mock Tests", value: mockTestCount ?? 0 },
    { label: "Test Attempts", value: attemptCount ?? 0 },
  ];

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-ink">Overview</h1>
      <p className="text-sm text-ink/50 mt-1">
        A quick snapshot of your platform right now.
      </p>
      <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="border border-line bg-white rounded-xl p-5">
            <p className="text-xs text-ink/40 uppercase tracking-widest">{s.label}</p>
            <p className="font-display font-bold text-3xl text-ink mt-2">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-10 border border-dashed border-line rounded-xl p-6 text-sm text-ink/50">
        Content upload, mock test creation, and question banks are built in
        Phase 6 onward. For now, this dashboard confirms you're securely
        logged in as admin and connected to your live database.
      </div>
    </div>
  );
}
