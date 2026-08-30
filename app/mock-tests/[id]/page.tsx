import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import SiteHeader from "@/components/SiteHeader";
import { createClient } from "@/lib/supabase/server";
import StartTestButton from "@/components/StartTestButton";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const supabase = await createClient();
  const { data: test } = await supabase
    .from("mock_tests")
    .select("title, duration_minutes, total_marks, exams(name)")
    .eq("id", id)
    .single();

  if (!test) return { title: "Test not found" };

  const exam: any = Array.isArray(test.exams) ? test.exams[0] : test.exams;

  return {
    title: test.title,
    description: `${test.title} — a timed, ${test.duration_minutes}-minute ${
      exam?.name ?? ""
    } mock test worth ${test.total_marks} marks, on PrepWise.`,
  };
}

export default async function MockTestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: test } = await supabase
    .from("mock_tests")
    .select(
      "id, title, duration_minutes, total_marks, access, published, exams(name), mock_test_questions(count)"
    )
    .eq("id", id)
    .single();

  if (!test || !test.published) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role = "guest";
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single();
    role = profile?.role ?? "free_user";
  }

  const hasAccess = test.access === "free" || role === "premium_user" || role === "admin";
  const qCount = (test as any).mock_test_questions?.[0]?.count ?? 0;
  const exam: any = Array.isArray((test as any).exams) ? (test as any).exams[0] : (test as any).exams;

  return (
    <main className="min-h-screen bg-paper">
      <SiteHeader />
      <div className="max-w-2xl mx-auto px-6 py-16">
        <Link href="/mock-tests" className="text-sm text-signal font-medium">
          &larr; All tests
        </Link>
        <p className="text-xs text-ink/40 mt-4">{exam?.name}</p>
        <h1 className="font-display font-bold text-3xl text-ink mt-1">{test.title}</h1>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="border border-line bg-white rounded-full px-3 py-1 text-ink/70">
            {test.duration_minutes} minutes
          </span>
          <span className="border border-line bg-white rounded-full px-3 py-1 text-ink/70">
            {test.total_marks} marks
          </span>
          <span className="border border-line bg-white rounded-full px-3 py-1 text-ink/70">
            {qCount} questions
          </span>
        </div>

        <div className="mt-10">
          {!user ? (
            <div className="bg-ink rounded-2xl p-8 text-center">
              <p className="text-paper/80 text-sm">
                You need a free account to take a test — this is how we save
                your score and history.
              </p>
              <div className="mt-5 flex gap-3 justify-center">
                <Link href="/login" className="border border-paper/30 text-paper px-5 py-2 rounded-lg text-sm font-medium">
                  Log in
                </Link>
                <Link href="/signup" className="bg-signal text-white px-5 py-2 rounded-lg text-sm font-medium">
                  Sign up
                </Link>
              </div>
            </div>
          ) : !hasAccess ? (
            <div className="bg-ink rounded-2xl p-8 text-center">
              <p className="text-pen text-2xl">&#128274;</p>
              <p className="text-paper/80 text-sm mt-3">
                This is a Premium test. Premium purchases aren't live yet —
                reach out directly to get upgraded.
              </p>
            </div>
          ) : qCount === 0 ? (
            <p className="text-sm text-ink/40">This test has no questions yet.</p>
          ) : (
            <StartTestButton mockTestId={test.id} />
          )}
        </div>
      </div>
    </main>
  );
}
