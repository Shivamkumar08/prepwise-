"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type ParsedQuestion = {
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "a" | "b" | "c" | "d";
  explanation: string;
  marks: number;
  negative_marks: number;
};

const EXAMPLE = `Q: What is the SI unit of force?
A) Joule
B) Newton
C) Watt
D) Pascal
Correct: B
Explanation: Force = mass × acceleration, measured in Newtons.
Marks: 4
Negative: 1

Q: Which gas do plants absorb during photosynthesis?
A) Oxygen
B) Nitrogen
C) Carbon dioxide
D) Hydrogen
Correct: C`;

function parseBulkQuestions(text: string): { questions: ParsedQuestion[]; errors: string[] } {
  const blocks = text
    .split(/\n\s*\n+/)
    .map((b) => b.trim())
    .filter(Boolean);

  const questions: ParsedQuestion[] = [];
  const errors: string[] = [];

  blocks.forEach((block, i) => {
    const lines = block
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    const qLineIndex = lines.findIndex((l) => /^Q:/i.test(l));
    if (qLineIndex === -1) {
      errors.push(`Block ${i + 1}: couldn't find a line starting with "Q:".`);
      return;
    }

    const questionLines: string[] = [lines[qLineIndex].replace(/^Q:/i, "").trim()];
    let idx = qLineIndex + 1;
    while (idx < lines.length && !/^[A-D]\)/i.test(lines[idx])) {
      questionLines.push(lines[idx]);
      idx++;
    }
    const question_text = questionLines.join(" ").trim();

    const getOption = (letter: string) => {
      const line = lines.find((l) => new RegExp(`^${letter}\\)`, "i").test(l));
      return line ? line.replace(new RegExp(`^${letter}\\)`, "i"), "").trim() : "";
    };
    const option_a = getOption("A");
    const option_b = getOption("B");
    const option_c = getOption("C");
    const option_d = getOption("D");

    const correctLine = lines.find((l) => /^Correct:/i.test(l));
    const correctRaw = correctLine ? correctLine.replace(/^Correct:/i, "").trim().toLowerCase() : "";
    const correct_option = (["a", "b", "c", "d"].includes(correctRaw) ? correctRaw : null) as
      | "a"
      | "b"
      | "c"
      | "d"
      | null;

    const explanationLine = lines.find((l) => /^Explanation:/i.test(l));
    const explanation = explanationLine ? explanationLine.replace(/^Explanation:/i, "").trim() : "";

    const marksLine = lines.find((l) => /^Marks:/i.test(l));
    const marksVal = marksLine ? parseFloat(marksLine.replace(/^Marks:/i, "").trim()) : 4;

    const negLine = lines.find((l) => /^Negative:/i.test(l));
    const negVal = negLine ? parseFloat(negLine.replace(/^Negative:/i, "").trim()) : 1;

    if (!question_text || !option_a || !option_b || !option_c || !option_d || !correct_option) {
      errors.push(
        `Block ${i + 1}: missing the question text, one of the 4 options, or a valid "Correct: A/B/C/D" line.`
      );
      return;
    }

    questions.push({
      question_text,
      option_a,
      option_b,
      option_c,
      option_d,
      correct_option,
      explanation,
      marks: isNaN(marksVal) ? 4 : marksVal,
      negative_marks: isNaN(negVal) ? 1 : negVal,
    });
  });

  return { questions, errors };
}

export default function BulkAddQuestions({
  mockTestId,
  nextOrder,
}: {
  mockTestId: string;
  nextOrder: number;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [parsed, setParsed] = useState<{ questions: ParsedQuestion[]; errors: string[] } | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handlePreview() {
    setError("");
    setSuccess("");
    setParsed(parseBulkQuestions(text));
  }

  async function handleAddAll() {
    if (!parsed || parsed.questions.length === 0) return;
    setSaving(true);
    setError("");
    const supabase = createClient();

    try {
      let order = nextOrder;
      for (const q of parsed.questions) {
        const { data: question, error: qError } = await supabase
          .from("questions")
          .insert(q)
          .select("id")
          .single();
        if (qError) throw qError;

        const { error: linkError } = await supabase.from("mock_test_questions").insert({
          mock_test_id: mockTestId,
          question_id: question.id,
          sort_order: order,
        });
        if (linkError) throw linkError;
        order++;
      }

      setSuccess(`Added ${parsed.questions.length} questions.`);
      setText("");
      setParsed(null);
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong partway through — check the test's question list.");
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm font-medium text-signal border border-line bg-white px-4 py-2 rounded-lg hover:border-signal/40"
      >
        Paste in multiple questions at once →
      </button>
    );
  }

  return (
    <div className="border border-line bg-white rounded-xl p-6">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-bold text-ink">Bulk add questions</h3>
        <button onClick={() => setOpen(false)} className="text-sm text-ink/40 hover:text-ink">
          Close
        </button>
      </div>
      <p className="text-sm text-ink/50 mt-2">
        Paste questions in this format, one per block, separated by a blank line:
      </p>
      <pre className="mt-3 bg-paper border border-line rounded-lg p-3 text-xs text-ink/70 overflow-x-auto whitespace-pre-wrap">
        {EXAMPLE}
      </pre>
      <p className="text-xs text-ink/40 mt-2">
        Explanation, Marks, and Negative are optional (default: 4 marks, -1 negative). This mode
        doesn&apos;t support images — use the single-question form above for those.
      </p>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        placeholder="Paste your questions here…"
        className="mt-4 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink font-body text-sm"
      />

      <div className="mt-3 flex gap-3">
        <button
          onClick={handlePreview}
          className="border border-line px-4 py-2 rounded-lg text-sm font-medium text-ink hover:border-ink/30"
        >
          Preview
        </button>
        {parsed && parsed.questions.length > 0 && (
          <button
            onClick={handleAddAll}
            disabled={saving}
            className="bg-signal text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-signalDark disabled:opacity-60"
          >
            {saving ? "Adding…" : `Add all ${parsed.questions.length} questions`}
          </button>
        )}
      </div>

      {parsed && (
        <div className="mt-4 text-sm">
          {parsed.questions.length > 0 && (
            <p className="text-correct">✓ {parsed.questions.length} question(s) parsed successfully.</p>
          )}
          {parsed.errors.length > 0 && (
            <div className="text-pen mt-2">
              <p>⚠ {parsed.errors.length} block(s) couldn&apos;t be parsed:</p>
              <ul className="list-disc list-inside mt-1">
                {parsed.errors.map((e, i) => (
                  <li key={i}>{e}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {error && <p className="text-sm text-pen mt-3">{error}</p>}
      {success && <p className="text-sm text-correct mt-3">{success}</p>}
    </div>
  );
}
