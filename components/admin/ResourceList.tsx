"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Resource = {
  id: string;
  title: string;
  content_type: string;
  access: string;
  published: boolean;
  file_path: string;
  exams: { name: string } | null;
  subjects: { name: string } | null;
};

export default function ResourceList({ resources }: { resources: Resource[] }) {
  const router = useRouter();

  async function togglePublish(id: string, current: boolean) {
    const supabase = createClient();
    await supabase.from("resources").update({ published: !current }).eq("id", id);
    router.refresh();
  }

  async function handleDelete(id: string, filePath: string) {
    if (!confirm("Delete this resource permanently? This can't be undone.")) return;
    const supabase = createClient();
    await supabase.storage.from("resources").remove([filePath]);
    await supabase.from("resources").delete().eq("id", id);
    router.refresh();
  }

  if (resources.length === 0) {
    return <p className="text-sm text-ink/40 mt-6">Nothing uploaded yet.</p>;
  }

  return (
    <div className="mt-8 border border-line bg-white rounded-xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-line text-left text-ink/40 text-xs uppercase tracking-widest">
            <th className="px-5 py-3">Title</th>
            <th className="px-5 py-3">Exam / Subject</th>
            <th className="px-5 py-3">Type</th>
            <th className="px-5 py-3">Access</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3"></th>
          </tr>
        </thead>
        <tbody>
          {resources.map((r) => (
            <tr key={r.id} className="border-b border-line last:border-0">
              <td className="px-5 py-3 text-ink font-medium">{r.title}</td>
              <td className="px-5 py-3 text-ink/60">
                {r.exams?.name} / {r.subjects?.name}
              </td>
              <td className="px-5 py-3 text-ink/60">{r.content_type}</td>
              <td className="px-5 py-3">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    r.access === "premium" ? "bg-pen/10 text-pen" : "bg-correct/10 text-correct"
                  }`}
                >
                  {r.access}
                </span>
              </td>
              <td className="px-5 py-3">
                <button
                  onClick={() => togglePublish(r.id, r.published)}
                  className={`text-xs px-2 py-0.5 rounded-full ${
                    r.published ? "bg-signal/10 text-signal" : "bg-ink/10 text-ink/50"
                  }`}
                >
                  {r.published ? "Published" : "Draft"}
                </button>
              </td>
              <td className="px-5 py-3 text-right">
                <button
                  onClick={() => handleDelete(r.id, r.file_path)}
                  className="text-xs text-pen hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
