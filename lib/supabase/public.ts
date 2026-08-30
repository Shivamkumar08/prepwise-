import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// A plain client with no cookies/session attached — used for things like
// the sitemap, which should reflect public content the same way for
// every visitor, logged in or not.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
