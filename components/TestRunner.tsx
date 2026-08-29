"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Question = {
  question_id: string;
  sort_order: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  marks: number;
  negative_marks: number;
};

type OptionKey = "a" | "b" | "c" | "d";

export default function TestRunner({
  mockTestId,
  attemptId,
  title,
  durationMinutes,
  startedAt,
}: {
  mockTestId: string;
  attemptId: string;
  title: string;
  durationMinutes: number;
  startedAt: string;
}) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});
  const [marked, setMarked] = useState<Set<string>>(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const submittedRef = useRef(false);

  const deadline = useMemo(
    () => new Date(startedAt).getTime() + durationMinutes * 60 * 1000,
    [startedAt, durationMinutes]
  );

  useEffect(() => {
    supabase
      .rpc("get_test_questions", { p_test_id: mockTestId })
      .then(({ data, error }) => {
        if (!error && data) setQuestions(data as Question[]);
        setLoading(false);
      });
  }, [mockTestId, supabase]);

  useEffect(() => {
    function tick() {
      const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0 && !submittedRef.current) {
        handleSubmit();
      }
    }
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deadline]);

  async function selectOption(questionId: string, option: OptionKey) {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
    await supabase.from("test_answers").upsert(
      { attempt_id: attemptId, question_id: questionId, selected_option: option },
      { onConflict: "attempt_id,question_id" }
    );
  }

  async function clearAnswer(questionId: string) {
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    await supabase.from("test_answers").upsert(
      { attempt_id: attemptId, question_id: questionId, selected_option: null },
      { onConflict: "attempt_id,question_id" }
    );
  }

  function toggleMark(questionId: string) {
    setMarked((prev) => {
      const next = new Set(prev);
      if (next.has(questionId)) next.delete(questionId);
      else next.add(questionId);
      return next;
    });
  }

  async function handleSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    await supabase.rpc("submit_test_attempt", { p_attempt_id: attemptId });
    router.push(`/mock-tests/${mockTestId}/attempt/${attemptId}/result`);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center">
        <p className="text-ink/50 text-sm">Loading test…</p>
      </div>
    );
  }

  const q = questions[current];
  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const timeString = `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-paper flex flex-col">
      <header className="bg-ink text-paper px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="font-display font-bold">{title}</p>
          <p className="text-xs text-paper/50">
            Question {current + 1} / {questions.length}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-paper/50 uppercase tracking-widest">Time left</p>
          <p className="font-body text-xl font-medium">{timeString}</p>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row max-w-5xl mx-auto w-full">
        <main className="flex-1 p-6">
          {q && (
            <>
              <p className="text-ink text-lg leading-relaxed">{q.question_text}</p>
              <div className="mt-6 space-y-3">
                {(["a", "b", "c", "d"] as const).map((opt) => {
                  const label =
                    opt === "a"
                      ? q.option_a
                      : opt === "b"
                      ? q.option_b
                      : opt === "c"
                      ? q.option_c
                      : q.option_d;
                  const selected = answers[q.question_id] === opt;
                  return (
                    <button
                      key={opt}
                      onClick={() => selectOption(q.question_id, opt)}
                      className={`w-full text-left flex items-center gap-3 border rounded-lg px-4 py-3 transition-colors ${
                        selected ? "border-signal bg-signal/5" : "border-line bg-white hover:border-ink/20"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full border flex-shrink-0 ${
                          selected ? "bg-signal border-signal" : "border-ink/30"
                        }`}
                      />
                      <span className="text-ink text-sm">{label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => clearAnswer(q.question_id)}
                  className="text-sm text-ink/60 border border-line px-4 py-2 rounded-lg hover:border-ink/30"
                >
                  Clear answer
                </button>
                <button
                  onClick={() => toggleMark(q.question_id)}
                  className={`text-sm px-4 py-2 rounded-lg border ${
                    marked.has(q.question_id)
                      ? "border-marked bg-marked/10 text-marked"
                      : "border-line text-ink/60 hover:border-ink/30"
                  }`}
                >
                  {marked.has(q.question_id) ? "Marked for review" : "Mark for review"}
                </button>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                  disabled={current === 0}
                  className="text-sm font-medium text-ink/70 disabled:opacity-30"
                >
                  &larr; Previous
                </button>
                {current === questions.length - 1 ? (
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="bg-pen text-white px-6 py-2.5 rounded-lg font-medium hover:bg-penDark transition-colors disabled:opacity-60"
                  >
                    {submitting ? "Submitting…" : "Submit Test"}
                  </button>
                ) : (
                  <button
                    onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                    className="text-sm font-medium text-signal"
                  >
                    Next &rarr;
                  </button>
                )}
              </div>
            </>
          )}
        </main>

        <aside className="order-first md:order-last md:w-56 border-b md:border-b-0 md:border-l border-line p-4 md:p-6">
          <p className="text-xs text-ink/40 uppercase tracking-widest mb-3">Questions</p>
          <div className="flex md:grid md:grid-cols-5 gap-2 overflow-x-auto md:overflow-visible pb-1">
            {questions.map((qq, i) => {
              const answered = !!answers[qq.question_id];
              const isMarked = marked.has(qq.question_id);
              return (
                <button
                  key={qq.question_id}
                  onClick={() => setCurrent(i)}
                  className={`w-10 h-10 md:w-9 md:h-9 flex-shrink-0 rounded-lg text-xs font-medium flex items-center justify-center border ${
                    i === current
                      ? "border-ink"
                      : isMarked
                      ? "bg-marked/20 border-marked text-marked"
                      : answered
                      ? "bg-correct/20 border-correct text-correct"
                      : "border-line text-ink/50"
                  }`}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="mt-4 md:mt-6 w-full bg-pen text-white py-2.5 rounded-lg text-sm font-medium hover:bg-penDark transition-colors disabled:opacity-60"
          >
            {submitting ? "Submitting…" : "Submit Test"}
          </button>
        </aside>
      </div>
    </div>
  );
}
