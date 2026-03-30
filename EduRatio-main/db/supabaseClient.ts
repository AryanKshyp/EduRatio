import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Keep boot explicit in development so missing DB config is visible.
  // This guard does not break build-time static imports.
  console.warn("Supabase environment variables are missing.");
}

export const supabase = createClient(supabaseUrl ?? "", supabaseAnonKey ?? "");
