import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";

type ReviewRow = {
  question_id: string;
  sort_order: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: "a" | "b" | "c" | "d";
  explanation: string | null;
  selected_option: "a" | "b" | "c" | "d" | null;
  is_correct: boolean | null;
  marks: number;
  negative_marks: number;
};

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>;
}) {
  const { attemptId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: attempt } = await supabase
    .from("test_attempts")
    .select(
      "id, user_id, submitted_at, score, correct_count, wrong_count, unattempted_count, time_taken_seconds, mock_tests(title, total_marks)"
    )
    .eq("id", attemptId)
    .single();

  if (!attempt || attempt.user_id !== user.id) notFound();
  if (!attempt.submitted_at) redirect(`/mock-tests`);

  const test: any = Array.isArray((attempt as any).mock_tests)
    ? (attempt as any).mock_tests[0]
    : (attempt as any).mock_tests;

  const { data: review } = await supabase.rpc("get_attempt_review", {
    p_attempt_id: attemptId,
  });

  const rows = (review as ReviewRow[]) ?? [];
  const minutes = Math.floor((attempt.time_taken_seconds ?? 0) / 60);
  const attempted = (attempt.correct_count ?? 0) + (attempt.wrong_count ?? 0);
  const accuracy = attempted > 0 ? Math.round(((attempt.correct_count ?? 0) / attempted) * 100) : 0;

  const optionLabel = (row: ReviewRow, key: "a" | "b" | "c" | "d") =>
    key === "a" ? row.option_a : key === "b" ? row.option_b : key === "c" ? row.option_c : row.option_d;

  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <p className="text-xs text-ink/40 uppercase tracking-widest text-center">{test?.title}</p>
        <h1 className="font-display font-extrabold text-4xl text-ink mt-2 text-center">
          {attempt.score} / {test?.total_marks}
        </h1>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="border border-line bg-white rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-correct">{attempt.correct_count}</p>
            <p className="text-xs text-ink/50 mt-1">Correct</p>
          </div>
          <div className="border border-line bg-white rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-pen">{attempt.wrong_count}</p>
            <p className="text-xs text-ink/50 mt-1">Wrong</p>
          </div>
          <div className="border border-line bg-white rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-ink/40">{attempt.unattempted_count}</p>
            <p className="text-xs text-ink/50 mt-1">Unattempted</p>
          </div>
          <div className="border border-line bg-white rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-signal">{accuracy}%</p>
            <p className="text-xs text-ink/50 mt-1">Accuracy</p>
          </div>
        </div>

        <p className="text-sm text-ink/50 mt-4 text-center">Time used: {minutes} minutes</p>

        <div className="mt-4 flex gap-3 justify-center">
          <Link
            href="/mock-tests"
            className="border border-line bg-white text-ink px-5 py-2 rounded-lg text-sm font-medium hover:border-ink/30"
          >
            Back to Mock Tests
          </Link>
          <Link
            href="/dashboard"
            className="bg-signal text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-signalDark"
          >
            My Dashboard
          </Link>
        </div>

        <h2 className="font-display font-bold text-xl text-ink mt-12">Question-by-question review</h2>
        <div className="mt-6 space-y-4">
          {rows.map((row, i) => {
            const statusColor =
              row.is_correct === true
                ? "border-correct"
                : row.is_correct === false
                ? "border-pen"
                : "border-line";
            return (
              <div key={row.question_id} className={`border-l-4 ${statusColor} bg-white rounded-r-xl p-5`}>
                <p className="text-xs text-ink/40">Question {i + 1}</p>
                <p className="text-ink font-medium mt-1">{row.question_text}</p>

                <div className="mt-4 space-y-2">
                  {(["a", "b", "c", "d"] as const).map((key) => {
                    const isCorrectOpt = row.correct_option === key;
                    const isSelectedOpt = row.selected_option === key;
                    return (
                      <div
                        key={key}
                        className={`text-sm rounded-lg px-3 py-2 border ${
                          isCorrectOpt
                            ? "border-correct bg-correct/5 text-correct"
                            : isSelectedOpt
                            ? "border-pen bg-pen/5 text-pen"
                            : "border-line text-ink/60"
                        }`}
                      >
                        {optionLabel(row, key)}
                        {isCorrectOpt && " — correct answer"}
                        {isSelectedOpt && !isCorrectOpt && " — your answer"}
                      </div>
                    );
                  })}
                  {!row.selected_option && (
                    <p className="text-xs text-ink/40 italic">You didn't answer this one.</p>
                  )}
                </div>

                {row.explanation && (
                  <p className="text-xs text-ink/50 mt-3 bg-paper rounded-lg p-3">
                    <span className="font-medium text-ink/70">Explanation: </span>
                    {row.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
