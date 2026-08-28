"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Exam = { id: string; name: string; slug: string };
type Subject = { id: string; exam_id: string; name: string; slug: string };

const CONTENT_TYPES = [
  { value: "short_notes", label: "Short Notes" },
  { value: "formula_notes", label: "Formula Notes" },
  { value: "pyq", label: "PYQ" },
  { value: "pyp", label: "PYP (Full Paper)" },
  { value: "study_material", label: "Study Material" },
  { value: "question_bank", label: "Question Bank" },
];

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function AddResourceForm({
  exams,
  subjects,
}: {
  exams: Exam[];
  subjects: Subject[];
}) {
  const router = useRouter();
  const [examId, setExamId] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [contentType, setContentType] = useState("short_notes");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [access, setAccess] = useState<"free" | "premium">("free");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const filteredSubjects = subjects.filter((s) => s.exam_id === examId);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!examId || !subjectId || !title || !file) {
      setError("Please fill in Exam, Subject, Title, and choose a file.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      let chapterId: string | null = null;

      if (chapterName.trim()) {
        const chapterSlug = slugify(chapterName);
        const { data: chapter, error: chapterError } = await supabase
          .from("chapters")
          .upsert(
            { subject_id: subjectId, slug: chapterSlug, name: chapterName.trim() },
            { onConflict: "subject_id,slug" }
          )
          .select("id")
          .single();

        if (chapterError) throw chapterError;
        chapterId = chapter.id;
      }

      const exam = exams.find((ex) => ex.id === examId);
      const subject = subjects.find((s) => s.id === subjectId);
      const fileExt = file.name.split(".").pop();
      const filePath = `${exam?.slug}/${subject?.slug}/${Date.now()}-${slugify(
        title
      )}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("resources")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { error: insertError } = await supabase.from("resources").insert({
        chapter_id: chapterId,
        exam_id: examId,
        subject_id: subjectId,
        title,
        description,
        content_type: contentType,
        file_path: filePath,
        access,
        published: true,
      });

      if (insertError) throw insertError;

      setSuccess("Published! It's now live.");
      setTitle("");
      setDescription("");
      setChapterName("");
      setFile(null);
      const fileInput = document.getElementById("file-input") as HTMLInputElement | null;
      if (fileInput) fileInput.value = "";
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line bg-white rounded-xl p-6 space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium text-ink/70">Exam</label>
          <select
            value={examId}
            onChange={(e) => {
              setExamId(e.target.value);
              setSubjectId("");
            }}
            className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink"
          >
            <option value="">Select exam</option>
            {exams.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium text-ink/70">Subject</label>
          <select
            value={subjectId}
            onChange={(e) => setSubjectId(e.target.value)}
            disabled={!examId}
            className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink disabled:opacity-50"
          >
            <option value="">Select subject</option>
            {filteredSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-ink/70">
          Chapter <span className="text-ink/40">(optional — type a new or existing one)</span>
        </label>
        <input
          type="text"
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
          placeholder="e.g. Electrostatics"
          className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink/70">Content Type</label>
        <select
          value={contentType}
          onChange={(e) => setContentType(e.target.value)}
          className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink"
        >
          {CONTENT_TYPES.map((ct) => (
            <option key={ct.value} value={ct.value}>
              {ct.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-ink/70">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink/70">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1 w-full border border-line rounded-lg px-3 py-2 bg-white text-ink"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink/70">Upload PDF</label>
        <input
          id="file-input"
          type="file"
          accept="application/pdf"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="mt-1 w-full text-sm text-ink/70"
        />
      </div>

      <div>
        <label className="text-sm font-medium text-ink/70 block mb-2">Access</label>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              checked={access === "free"}
              onChange={() => setAccess("free")}
            />
            Free
          </label>
          <label className="flex items-center gap-2 text-sm text-ink">
            <input
              type="radio"
              checked={access === "premium"}
              onChange={() => setAccess("premium")}
            />
            Premium
          </label>
        </div>
      </div>

      {error && <p className="text-sm text-pen">{error}</p>}
      {success && <p className="text-sm text-correct">{success}</p>}

      <button
        type="submit"
        disabled={loading}
        className="bg-signal text-white px-6 py-2.5 rounded-lg font-medium hover:bg-signalDark transition-colors disabled:opacity-60"
      >
        {loading ? "Publishing…" : "Publish"}
      </button>
    </form>
  );
}
