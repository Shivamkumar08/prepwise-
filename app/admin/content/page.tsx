import { createClient } from "@/lib/supabase/server";
import AddResourceForm from "@/components/admin/AddResourceForm";
import ResourceList from "@/components/admin/ResourceList";

export default async function AdminContentPage() {
  const supabase = await createClient();

  const [{ data: exams }, { data: subjects }, { data: resources }] = await Promise.all([
    supabase.from("exams").select("id, name, slug").order("sort_order"),
    supabase.from("subjects").select("id, exam_id, name, slug").order("sort_order"),
    supabase
      .from("resources")
      .select("id, title, content_type, access, published, file_path, exams(name), subjects(name)")
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <h1 className="font-display font-bold text-2xl text-ink">Add Content</h1>
      <p className="text-sm text-ink/50 mt-1">
        Upload a note, formula sheet, PYQ, or study material. It appears on
        the site immediately after publishing.
      </p>

      <div className="mt-8">
        <AddResourceForm exams={exams ?? []} subjects={subjects ?? []} />
      </div>

      <h2 className="font-display font-bold text-lg text-ink mt-12">
        All Content
      </h2>
      <ResourceList resources={(resources as any) ?? []} />
    </div>
  );
}
