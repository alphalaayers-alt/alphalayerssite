import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { hasServerEnv, readServerEnv } from '../server-env';

let client: SupabaseClient | null = null;

/** True when STORAGE_MODE=supabase and credentials exist. */
export function isSupabaseEnabled(): boolean {
  const mode = readServerEnv('STORAGE_MODE').toLowerCase();
  if (mode === 'json' || mode === '') return false;
  const url = readServerEnv('SUPABASE_URL');
  const key = readServerEnv('SUPABASE_SERVICE_ROLE_KEY');
  return Boolean((mode === 'supabase' || mode === 'true') && url && key);
}

export function getSupabase(): SupabaseClient {
  if (!isSupabaseEnabled()) {
    throw new Error('Supabase is not enabled. Set STORAGE_MODE=supabase and SUPABASE_* keys.');
  }
  if (!client) {
    client = createClient(readServerEnv('SUPABASE_URL'), readServerEnv('SUPABASE_SERVICE_ROLE_KEY'), {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return client;
}

export function supabaseStatus() {
  return {
    enabled: isSupabaseEnabled(),
    configured: hasServerEnv('SUPABASE_URL') && hasServerEnv('SUPABASE_SERVICE_ROLE_KEY'),
    mode: readServerEnv('STORAGE_MODE') || 'json',
    hasUrl: hasServerEnv('SUPABASE_URL'),
    hasServiceKey: hasServerEnv('SUPABASE_SERVICE_ROLE_KEY'),
    hasStorageMode: hasServerEnv('STORAGE_MODE'),
    isVercel: Boolean(process.env.VERCEL),
  };
}
