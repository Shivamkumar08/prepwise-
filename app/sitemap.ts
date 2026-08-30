import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";

const SITE_URL = "https://prep-wize.vercel.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = createPublicClient();

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/exams`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/resources`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/mock-tests`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
  ];

  const { data: exams } = await supabase.from("exams").select("slug");
  const examPages: MetadataRoute.Sitemap = (exams ?? []).map((e) => ({
    url: `${SITE_URL}/exams/${e.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const { data: resources } = await supabase
    .from("resources")
    .select("id, created_at")
    .eq("published", true);
  const resourcePages: MetadataRoute.Sitemap = (resources ?? []).map((r) => ({
    url: `${SITE_URL}/resources/${r.id}`,
    lastModified: new Date(r.created_at),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const { data: tests } = await supabase
    .from("mock_tests")
    .select("id, created_at")
    .eq("published", true);
  const testPages: MetadataRoute.Sitemap = (tests ?? []).map((t) => ({
    url: `${SITE_URL}/mock-tests/${t.id}`,
    lastModified: new Date(t.created_at),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticPages, ...examPages, ...resourcePages, ...testPages];
}
