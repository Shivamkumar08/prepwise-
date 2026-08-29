import Link from "next/link";
import { notFound } from "next/navigation";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";

const CONTENT_TYPE_LABELS: Record<string, string> = {
  short_notes: "Short Notes",
  formula_notes: "Formula Notes",
  pyq: "PYQ",
  pyp: "PYP",
  study_material: "Study Material",
  question_bank: "Question Bank",
};

export default async function ExamPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: exam } = await supabase
    .from("exams")
    .select("id, name, description")
    .eq("slug", slug)
    .single();

  if (!exam) notFound();

  const { data: resources } = await supabase
    .from("resources")
    .select("id, title, content_type, access, subjects(name), chapters(name)")
    .eq("exam_id", exam.id)
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/exams" className="text-sm text-signal font-medium">
          &larr; All exams
        </Link>
        <h1 className="font-display font-bold text-3xl text-ink mt-4">{exam.name}</h1>
        {exam.description && <p className="text-ink/60 mt-2">{exam.description}</p>}

        <div className="mt-10 space-y-3">
          {(resources ?? []).length === 0 && (
            <p className="text-sm text-ink/40 border border-dashed border-line rounded-xl p-6">
              Nothing published for this exam yet — check back soon.
            </p>
          )}
          {(resources ?? []).map((r: any) => (
            <Link
              key={r.id}
              href={`/resources/${r.id}`}
              className="flex items-center justify-between border border-line bg-white rounded-xl px-5 py-4 hover:border-signal/40 hover:shadow-sm transition-all"
            >
              <div>
                <p className="text-xs text-ink/40">
                  {r.subjects?.name}
                  {r.chapters?.name ? ` · ${r.chapters.name}` : ""} ·{" "}
                  {CONTENT_TYPE_LABELS[r.content_type] ?? r.content_type}
                </p>
                <p className="font-display font-bold text-ink mt-1">{r.title}</p>
              </div>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                  r.access === "premium"
                    ? "bg-pen/10 text-pen"
                    : "bg-correct/10 text-correct"
                }`}
              >
                {r.access === "premium" ? "🔒 Premium" : "Free"}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
