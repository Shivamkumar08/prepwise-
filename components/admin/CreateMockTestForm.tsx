"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Exam = { id: string; name: string };
type Subject = { id: string; exam_id: string; name: string };

export default function CreateMockTestForm({
  exams,
  subjects,
}: {
  exams: Exam[];
  subjects: Subject[];
}) {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [examId, setExamId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [duration, setDuration] = useState(60);
  const [totalMarks, setTotalMarks] = useState(100);
  const [access, setAccess] = useState<"free" | "premium">("free");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const filteredSubjects = subjects.filter((s) => s.exam_id === examId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!title || !examId) {
      setError("Please fill in a title and select an exam.");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from("mock_tests")
      .insert({
        title,
        exam_id: examId,
        subject_id: subjectId || null,
        duration_minutes: duration,
        total_marks: totalMarks,
        access,
        published: false,
      })
      .select("id")
      .single();
    setLoading(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    router.push(`/admin/mock-tests/${data.id}`);
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line bg-white rounded-xl p-6 space-y-4">
      <div>
        <label className="text-sm font-medium text-ink/70">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. JEE Main Physics Full Test 01"
          className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink"
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-ink/70">Exam</label>
          <select
            value={examId}
            onChange={(e) => {
              setExamId(e.target.value);
              setSubjectId("");
            }}
            className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink"
          >
            <option value="">Select exam</option>
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">
            Subject <span className="text-ink/40">(optional)</span>
          </label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            disabled={!examId}
            className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink disabled:opacity-50"
          >
            <option value="">All subjects</option>
            {filteredSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-ink/70">Duration (minutes)</label>
          <input
            type="number"
            min={1}
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Total Marks</label>
          <input
            type="number"
            min={1}
            value={totalMarks}
            onChange={(e) => setTotalMarks(Number(e.target.value))}
            className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink"
          />
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-ink/70 block mb-2">Access</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="radio" checked={access === "free"} onChange={() => setAccess("free")} />
            Free
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input type="radio" checked={access === "premium"} onChange={() => setAccess("premium")} />
            Premium
          </label>
        </div>
      </div>
      {error && <p className="text-sm text-pen">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-signal text-white px-6 py-2.5 rounded-lg font-medium hover:bg-signalDark transition-colors disabled:opacity-60"
      >
        {loading ? "Creating…" : "Create test & add questions"}
      </button>
    </form>
  );
}
