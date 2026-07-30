import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

function cleanEnv(value: string | undefined): string {
  return (value || '').trim().replace(/^["']|["']$/g, '');
}

/** True when STORAGE_MODE=supabase and credentials exist. */
export function isSupabaseEnabled(): boolean {
  const mode = cleanEnv(process.env.STORAGE_MODE).toLowerCase();
  if (mode === 'json' || mode === '') return false;
  const url = cleanEnv(process.env.SUPABASE_URL);
  const key = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY);
  return Boolean((mode === 'supabase' || mode === 'true') && url && key);
}

export function getSupabase(): SupabaseClient {
  if (!isSupabaseEnabled()) {
    throw new Error('Supabase is not enabled. Set STORAGE_MODE=supabase and SUPABASE_* keys.');
  }
  if (!client) {
    client = createClient(cleanEnv(process.env.SUPABASE_URL), cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export function supabaseStatus() {
  return {
    enabled: isSupabaseEnabled(),
    configured: Boolean(cleanEnv(process.env.SUPABASE_URL) && cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)),
    mode: cleanEnv(process.env.STORAGE_MODE) || 'json',
    hasUrl: Boolean(cleanEnv(process.env.SUPABASE_URL)),
    hasServiceKey: Boolean(cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)),
    isVercel: Boolean(process.env.VERCEL),
  };
}
