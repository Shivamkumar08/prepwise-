"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Link = {
  id: string;
  sort_order: number;
  questions: {
    id: string;
    question_text: string;
    correct_option: string;
    marks: number;
    negative_marks: number;
  } | null;
};

export default function QuestionList({ links }: { links: Link[] }) {
  const router = useRouter();

  async function handleDelete(linkId: string, questionId: string | undefined) {
    if (!confirm("Remove this question from the test? It will be deleted entirely.")) return;
    const supabase = createClient();
    await supabase.from("mock_test_questions").delete().eq("id", linkId);
    if (questionId) {
      await supabase.from("questions").delete().eq("id", questionId);
    }
    router.refresh();
  }

  if (links.length === 0) {
    return <p className="text-sm text-ink/40 mt-6">No questions added yet.</p>;
  }

  return (
    <div className="mt-6 space-y-3">
      {links.map((link, i) => (
        <div key={link.id} className="border border-line bg-white rounded-xl p-4">
          <div className="flex justify-between items-start gap-4">
            <div>
              <p className="text-xs text-ink/40">Question {i + 1}</p>
              <p className="text-ink font-medium mt-1">{link.questions?.question_text}</p>
              <p className="text-xs text-correct mt-2">
                Correct: {link.questions?.correct_option?.toUpperCase()} · +
                {link.questions?.marks} / -{link.questions?.negative_marks}
              </p>
            </div>
            <button
              onClick={() => handleDelete(link.id, link.questions?.id)}
              className="text-xs text-pen hover:underline whitespace-nowrap"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
