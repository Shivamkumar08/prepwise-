import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export default async function ResourcesIndexPage() {
  const supabase = await createClient();
  const { data: resources } = await supabase
    .from("resources")
    .select("id, title, content_type, access, exams(name), subjects(name)")
    .eq("published", true)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-paper">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <Link href="/" className="font-display font-extrabold text-ink">
          PrepWise
        </Link>
        <h1 className="font-display font-bold text-3xl text-ink mt-6">
          All resources
        </h1>
        <p className="text-ink/60 mt-2">
          Browse everything published so far, across every exam.
        </p>

        <div className="mt-10 space-y-3">
          {(resources ?? []).length === 0 && (
            <p className="text-sm text-ink/40 border border-dashed border-line rounded-xl p-6">
              Nothing published yet — check back soon.
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
                  {r.exams?.name} · {r.subjects?.name}
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
