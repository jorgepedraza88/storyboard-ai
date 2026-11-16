import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase = createClient<Database>(
  url ?? "https://placeholder.supabase.co",
  anonKey ?? "placeholder-anon-key",
);

export const STORYBOARD_IMAGES_BUCKET = "storyboard-images";
