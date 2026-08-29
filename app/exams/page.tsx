import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";

export default async function ExamsIndexPage() {
  const supabase = await createClient();
  const { data: exams } = await supabase
    .from("exams")
    .select("id, slug, name, description")
    .order("sort_order");

  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="font-display font-bold text-3xl text-ink mt-2">
          Choose your exam
        </h1>
        <div className="mt-8 grid sm:grid-cols-2 gap-4">
          {(exams ?? []).map((exam) => (
            <Link
              key={exam.id}
              href={`/exams/${exam.slug}`}
              className="border border-line bg-white rounded-xl p-5 hover:border-signal/40 hover:shadow-sm transition-all"
            >
              <h2 className="font-display font-bold text-lg text-ink">{exam.name}</h2>
              <p className="text-sm text-ink/60 mt-1">{exam.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
