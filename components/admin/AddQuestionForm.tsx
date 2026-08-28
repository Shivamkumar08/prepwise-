"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AddQuestionForm({
  mockTestId,
  nextOrder,
}: {
  mockTestId: string;
  nextOrder: number;
}) {
  const router = useRouter();
  const [questionText, setQuestionText] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correct, setCorrect] = useState<"a" | "b" | "c" | "d">("a");
  const [explanation, setExplanation] = useState("");
  const [marks, setMarks] = useState(4);
  const [negativeMarks, setNegativeMarks] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!questionText || !optionA || !optionB || !optionC || !optionD) {
      setError("Please fill in the question and all 4 options.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      const { data: question, error: qError } = await supabase
        .from("questions")
        .insert({
          question_text: questionText,
          option_a: optionA,
          option_b: optionB,
          option_c: optionC,
          option_d: optionD,
          correct_option: correct,
          explanation,
          marks,
          negative_marks: negativeMarks,
        })
        .select("id")
        .single();

      if (qError) throw qError;

      const { error: linkError } = await supabase.from("mock_test_questions").insert({
        mock_test_id: mockTestId,
        question_id: question.id,
        sort_order: nextOrder,
      });

      if (linkError) throw linkError;

      setSuccess("Question added.");
      setQuestionText("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setExplanation("");
      setCorrect("a");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line bg-white rounded-xl p-6 space-y-4">
      <div>
        <label className="text-sm font-medium text-ink/70">Question</label>
        <textarea
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          rows={3}
          className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-ink/70">Option A</label>
          <input
            type="text"
            value={optionA}
            onChange={(e) => setOptionA(e.target.value)}
            className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Option B</label>
          <input
            type="text"
            value={optionB}
            onChange={(e) => setOptionB(e.target.value)}
            className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Option C</label>
          <input
            type="text"
            value={optionC}
            onChange={(e) => setOptionC(e.target.value)}
            className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Option D</label>
          <input
            type="text"
            value={optionD}
            onChange={(e) => setOptionD(e.target.value)}
            className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink/70 block mb-2">Correct Answer</label>
        <div className="flex gap-4">
          {(["a", "b", "c", "d"] as const).map((opt) => (
            <label key={opt} className="flex items-center gap-2 text-sm text-ink uppercase">
              <input type="radio" checked={correct === opt} onChange={() => setCorrect(opt)} />
              {opt}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink/70">
          Explanation <span className="text-ink/40">(optional, shown after submitting)</span>
        </label>
        <textarea
          value={explanation}
          onChange={(e) => setExplanation(e.target.value)}
          rows={2}
          className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-ink/70">Marks (if correct)</label>
          <input
            type="number"
            value={marks}
            onChange={(e) => setMarks(Number(e.target.value))}
            className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Negative Marks (if wrong)</label>
          <input
            type="number"
            value={negativeMarks}
            onChange={(e) => setNegativeMarks(Number(e.target.value))}
            className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink"
          />
        </div>
      </div>

      {error && <p className="text-sm text-pen">{error}</p>}
      {success && <p className="text-sm text-correct">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-signal text-white px-6 py-2.5 rounded-lg font-medium hover:bg-signalDark transition-colors disabled:opacity-60"
      >
        {loading ? "Adding…" : "Add question"}
      </button>
    </form>
  );
}
