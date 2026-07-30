import { NextResponse } from 'next/server';
import { getSupabase, isSupabaseEnabled, supabaseStatus } from '@/lib/supabase/client';

/** Public storage health check — no secrets returned. Used to debug production login. */
export async function GET() {
  const status = supabaseStatus();

  if (!isSupabaseEnabled()) {
    return NextResponse.json({
      ...status,
      ok: false,
      hint: 'Set STORAGE_MODE=supabase, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY in Vercel env vars, then Redeploy.',
    });
  }

  try {
    const sb = getSupabase();
    const { error } = await sb.from('admin_users').select('id').limit(1);
    if (error) {
      return NextResponse.json({
        ...status,
        ok: false,
        dbError: error.message,
        hint: 'Run supabase/schema.sql in Supabase SQL Editor, or fix the service role key.',
      });
    }
    return NextResponse.json({ ...status, ok: true });
  } catch (err) {
    return NextResponse.json({
      ...status,
      ok: false,
      dbError: err instanceof Error ? err.message : 'Unknown error',
      hint: 'Check SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY on Vercel.',
    });
  }
}
