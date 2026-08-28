import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export default async function ResourceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: resource } = await supabase
    .from("resources")
    .select(
      "id, title, description, content_type, access, published, file_path, exams(name, slug), subjects(name)"
    )
    .eq("id", id)
    .single();

  if (!resource || !resource.published) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let role = "guest";
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    role = profile?.role ?? "free_user";
  }

  const hasAccess =
    resource.access === "free" || role === "premium_user" || role === "admin";

  let fileUrl: string | null = null;
  if (hasAccess) {
    const { data: signed } = await supabase.storage
      .from("resources")
      .createSignedUrl(resource.file_path, 60 * 10);
    fileUrl = signed?.signedUrl ?? null;
  }

  const exam: any = Array.isArray(resource.exams) ? resource.exams[0] : resource.exams;
  const subject: any = Array.isArray(resource.subjects)
    ? resource.subjects[0]
    : resource.subjects;

  return (
    <main className="min-h-screen bg-paper">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link
          href={exam?.slug ? `/exams/${exam.slug}` : "/resources"}
          className="text-sm text-signal font-medium"
        >
          &larr; Back
        </Link>

        <p className="text-xs text-ink/40 mt-4">
          {exam?.name} {subject?.name ? `- ${subject.name}` : ""}
        </p>
        <h1 className="font-display font-bold text-3xl text-ink mt-1">
          {resource.title}
        </h1>
        {resource.description && (
          <p className="text-ink/60 mt-3">{resource.description}</p>
        )}

        <div className="mt-8">
          {hasAccess && fileUrl ? (
            <div className="border border-line rounded-xl overflow-hidden bg-white">
              <iframe src={fileUrl} className="w-full h-[70vh]" title={resource.title} />
              <div className="p-4 border-t border-line flex justify-end">
                
                  href={fileUrl}
                  download
                  className="bg-signal text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-signalDark transition-colors"
                >
                  Download PDF
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-ink rounded-2xl p-10 text-center">
              <p className="text-pen text-3xl">&#128274;</p>
              <h2 className="font-display font-bold text-xl text-paper mt-4">
                This is Premium content
              </h2>
              <p className="text-paper/60 mt-2 text-sm max-w-sm mx-auto">
                {user
                  ? "Your account isn't premium yet. Premium purchases aren't live on the site yet, so for now reach out directly to get upgraded."
                  : "Log in or create a free account, then reach out to get upgraded to Premium."}
              </p>
              <div className="mt-6 flex gap-3 justify-center">
                {!user && (
                  <>
                    <Link
                      href="/login"
                      className="border border-paper/30 text-paper px-5 py-2 rounded-lg text-sm font-medium"
                    >
                      Log in
                    </Link>
                    <Link
                      href="/signup"
                      className="bg-signal text-white px-5 py-2 rounded-lg text-sm font-medium"
                    >
                      Sign up
                    </Link>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
