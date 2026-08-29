import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function MockTestsIndexPage() {
  const supabase = await createClient();
  const { data: tests } = await supabase
    .from("mock_tests")
    .select("id, title, duration_minutes, total_marks, access, exams(name), subjects(name)")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/" className="font-display font-extrabold text-ink">
          PrepWise
        </Link>
        <h1 className="font-display font-bold text-3xl text-ink mt-6">Mock Tests</h1>
        <p className="text-ink/60 mt-2">Timed, exam-style practice tests.</p>

        <div className="mt-10 space-y-3">
          {(tests ?? []).length === 0 && (
            <p className="text-sm text-ink/40 border border-dashed border-line rounded-xl p-6">
              No tests published yet — check back soon.
            </p>
          )}
          {(tests ?? []).map((t: any) => (
            <Link
              key={t.id}
              href={`/mock-tests/${t.id}`}
              className="flex items-center justify-between border border-line bg-white rounded-xl px-5 py-4 hover:border-signal/40 hover:shadow-sm transition-all"
            >
              <div>
                <p className="text-xs text-ink/40">
                  {t.exams?.name}
                  {t.subjects?.name ? ` - ${t.subjects.name}` : ""} - {t.duration_minutes} min - {t.total_marks} marks
                </p>
                <p className="font-display font-bold text-ink mt-1">{t.title}</p>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                  t.access === "premium" ? "bg-pen/10 text-pen" : "bg-correct/10 text-correct"
                }`}
              >
                {t.access === "premium" ? "🔒 Premium" : "Free"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
