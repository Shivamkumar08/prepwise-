import { notFound } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import AddQuestionForm from "@/components/admin/AddQuestionForm";
import QuestionList from "@/components/admin/QuestionList";

export default async function ManageMockTestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: test } = await supabase
    .from("mock_tests")
    .select("id, title, duration_minutes, total_marks, access, published, exams(name)")
    .eq("id", id)
    .single();

  if (!test) notFound();

  const { data: links } = await supabase
    .from("mock_test_questions")
    .select(
      "id, sort_order, questions(id, question_text, option_a, option_b, option_c, option_d, correct_option, marks, negative_marks)"
    )
    .eq("mock_test_id", id)
    .order("sort_order");

  const exam: any = Array.isArray((test as any).exams) ? (test as any).exams[0] : (test as any).exams;

  return (
    <div>
      <Link href="/admin/mock-tests" className="text-sm text-signal font-medium">
        &larr; All tests
      </Link>
      <h1 className="font-display font-bold text-2xl text-ink mt-4">{test.title}</h1>
      <p className="text-sm text-ink/50 mt-1">
        {exam?.name} - {test.duration_minutes} min - {test.total_marks} marks -{" "}
        {(links ?? []).length} question{(links ?? []).length === 1 ? "" : "s"}
      </p>

      <div className="mt-8">
        <AddQuestionForm mockTestId={test.id} nextOrder={(links ?? []).length} />
      </div>

      <h2 className="font-display font-bold text-lg text-ink mt-12">
        Questions in this test
      </h2>
      <QuestionList links={(links as any) ?? []} />
    </div>
  );
}
