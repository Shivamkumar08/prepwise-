import { createClient } from "@/lib/supabase/server";
import CreateMockTestForm from "@/components/admin/CreateMockTestForm";
import MockTestList from "@/components/admin/MockTestList";

export default async function AdminMockTestsPage() {
  const supabase = await createClient();

  const [{ data: exams }, { data: subjects }, { data: tests }] = await Promise.all([
    supabase.from("exams").select("id, name, slug").order("sort_order"),
    supabase.from("subjects").select("id, exam_id, name, slug").order("sort_order"),
    supabase
      .from("mock_tests")
      .select(
        "id, title, duration_minutes, total_marks, access, published, exams(name), subjects(name), mock_test_questions(count)"
      )
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-ink">Mock Tests</h1>
      <p className="text-sm text-ink/50 mt-1">
        Create a test, then add questions to it before publishing.
      </p>

      <div className="mt-8">
        <CreateMockTestForm exams={exams ?? []} subjects={subjects ?? []} />
      </div>

      <h2 className="font-display font-bold text-lg text-ink mt-12">All Tests</h2>
      <MockTestList tests={(tests as any) ?? []} />
    </div>
  );
}
