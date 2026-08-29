import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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
      "id, user_id, score, correct_count, wrong_count, unattempted_count, time_taken_seconds, mock_tests(title, total_marks)"
    )
    .eq("id", attemptId)
    .single();

  if (!attempt || attempt.user_id !== user.id) notFound();

  const test: any = Array.isArray((attempt as any).mock_tests)
    ? (attempt as any).mock_tests[0]
    : (attempt as any).mock_tests;

  const minutes = Math.floor((attempt.time_taken_seconds ?? 0) / 60);

  return (
    <main className="min-h-screen bg-paper flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <p className="text-xs text-ink/40 uppercase tracking-widest">{test?.title}</p>
        <h1 className="font-display font-extrabold text-4xl text-ink mt-2">
          {attempt.score} / {test?.total_marks}
        </h1>
        <div className="mt-8 grid grid-cols-3 gap-3">
          <div className="border border-line bg-white rounded-xl p-4">
            <p className="text-2xl font-bold text-correct">{attempt.correct_count}</p>
            <p className="text-xs text-ink/50 mt-1">Correct</p>
          </div>
          <div className="border border-line bg-white rounded-xl p-4">
            <p className="text-2xl font-bold text-pen">{attempt.wrong_count}</p>
            <p className="text-xs text-ink/50 mt-1">Wrong</p>
          </div>
          <div className="border border-line bg-white rounded-xl p-4">
            <p className="text-2xl font-bold text-ink/40">{attempt.unattempted_count}</p>
            <p className="text-xs text-ink/50 mt-1">Unattempted</p>
          </div>
        </div>
        <p className="text-sm text-ink/50 mt-6">Time used: {minutes} minutes</p>
        <p className="text-xs text-ink/30 mt-1">
          Detailed question-by-question review is coming in the next phase.
        </p>
        <Link
          href="/mock-tests"
          className="inline-block mt-8 bg-signal text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-signalDark transition-colors"
        >
          Back to Mock Tests
        </Link>
      </div>
    </main>
  );
}
