import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let client: SupabaseClient | null = null;

/** True when STORAGE_MODE=supabase and credentials exist. */
export function isSupabaseEnabled(): boolean {
  const mode = (process.env.STORAGE_MODE || '').toLowerCase();
  if (mode === 'json') return false;
  return Boolean(
    (mode === 'supabase' || mode === 'true') &&
      process.env.SUPABASE_URL &&
      process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

export function getSupabase(): SupabaseClient {
  if (!isSupabaseEnabled()) {
    throw new Error('Supabase is not enabled. Set STORAGE_MODE=supabase and SUPABASE_* keys.');
  }
  if (!client) {
    client = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: { persistSession: false, autoRefreshToken: false },
      }
    );
  }
  return client;
}

export function supabaseStatus() {
  return {
    enabled: isSupabaseEnabled(),
    configured: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    mode: process.env.STORAGE_MODE || 'json',
  };
}
