import { createClient } from "@/lib/supabase/server";

export async function loadPublicSeo() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("restaurant")
      .select("name, tagline")
      .limit(1)
      .maybeSingle();
    if (error || !data) return null;
    return data as { name: string; tagline: string | null };
  } catch {
    return null;
  }
}
