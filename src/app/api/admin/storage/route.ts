import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { supabaseStatus } from '@/lib/supabase/client';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return NextResponse.json({
    ...supabaseStatus(),
    hint:
      'Set STORAGE_MODE=supabase, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY in .env.local, then run supabase/schema.sql in the Supabase SQL Editor.',
  });
}
