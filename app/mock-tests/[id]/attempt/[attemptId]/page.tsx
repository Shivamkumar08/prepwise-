import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import TestRunner from "@/components/TestRunner";

export default async function AttemptPage({
  params,
}: {
  params: Promise<{ id: string; attemptId: string }>;
}) {
  const { id, attemptId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: attempt } = await supabase
    .from("test_attempts")
    .select("id, user_id, mock_test_id, started_at, submitted_at")
    .eq("id", attemptId)
    .single();

  if (!attempt || attempt.user_id !== user.id || attempt.mock_test_id !== id) {
    notFound();
  }

  if (attempt.submitted_at) {
    redirect(`/mock-tests/${id}/attempt/${attemptId}/result`);
  }

  const { data: test } = await supabase
    .from("mock_tests")
    .select("id, title, duration_minutes")
    .eq("id", id)
    .single();

  if (!test) notFound();

  return (
    <TestRunner
      mockTestId={test.id}
      attemptId={attempt.id}
      title={test.title}
      durationMinutes={test.duration_minutes}
      startedAt={attempt.started_at}
    />
  );
}
