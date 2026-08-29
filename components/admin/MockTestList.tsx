"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Test = {
  id: string;
  title: string;
  duration_minutes: number;
  total_marks: number;
  access: string;
  published: boolean;
  exams: { name: string } | null;
  subjects: { name: string } | null;
  mock_test_questions: { count: number }[];
};

export default function MockTestList({ tests }: { tests: Test[] }) {
  const router = useRouter();

  async function togglePublish(id: string, current: boolean) {
    const supabase = createClient();
    await supabase.from("mock_tests").update({ published: !current }).eq("id", id);
    router.refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this test permanently? This can't be undone.")) return;
    const supabase = createClient();
    await supabase.from("mock_tests").delete().eq("id", id);
    router.refresh();
  }

  if (tests.length === 0) {
    return <p className="text-sm text-ink/40 mt-6">No tests created yet.</p>;
  }

  return (
    <div className="mt-8 border border-line bg-white rounded-xl overflow-x-auto">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-line text-left text-ink/40 text-xs uppercase tracking-widest">
            <th className="px-5 py-3">Title</th>
            <th className="px-5 py-3">Exam</th>
            <th className="px-5 py-3">Questions</th>
            <th className="px-5 py-3">Access</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {tests.map((t) => {
            const qCount = t.mock_test_questions?.[0]?.count ?? 0;
            return (
              <tr key={t.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3">
                  <Link href={`/admin/mock-tests/${t.id}`} className="text-ink font-medium hover:text-signal">
                    {t.title}
                  </Link>
                </td>
                <td className="px-5 py-3 text-ink/60">{t.exams?.name}</td>
                <td className="px-5 py-3 text-ink/60">{qCount}</td>
                <td className="px-5 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      t.access === "premium" ? "bg-pen/10 text-pen" : "bg-correct/10 text-correct"
                    }`}
                  >
                    {t.access}
                  </span>
                </td>
                <td className="px-5 py-3">
                  <button
                    onClick={() => togglePublish(t.id, t.published)}
                    disabled={qCount === 0 && !t.published}
                    className={`text-xs px-2 py-0.5 rounded-full disabled:opacity-40 ${
                      t.published ? "bg-signal/10 text-signal" : "bg-ink/10 text-ink/50"
                    }`}
                    title={qCount === 0 ? "Add at least one question first" : ""}
                  >
                    {t.published ? "Published" : "Draft"}
                  </button>
                </td>
                <td className="px-5 py-3 text-right">
                  <button onClick={() => handleDelete(t.id)} className="text-xs text-pen hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
