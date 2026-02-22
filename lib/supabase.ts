import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

/** Public browser-safe client (anon key) */
export function createBrowserClient() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

/** Server-only admin client (service role key – bypasses RLS) */
export function createServiceClient() {
  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
  });
}

export type Profile = {
  id: string;
  email: string;
  full_name: string;
  profession: string;
  raw_bio: string | null;
  bio: string | null;
  philosophy: string | null;
  profile_img: string | null;
  projects_json: { title: string; img_url: string }[];
  subdomain: string;
  created_at: string;
};
