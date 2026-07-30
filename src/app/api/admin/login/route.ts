import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, ADMIN_USER_COOKIE, createUserSessionToken } from '@/lib/admin-auth';
import { isSupabaseEnabled, supabaseStatus } from '@/lib/supabase/client';
import { getUserByEmail, verifyUserPassword } from '@/lib/users';

function setSessionCookies(
  response: NextResponse,
  token: string,
  userId: string
) {
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  };
  response.cookies.set(ADMIN_COOKIE, token, opts);
  response.cookies.set(ADMIN_USER_COOKIE, userId, opts);
}

function loginConfigErrorMessage(err: unknown): string {
  const message = err instanceof Error ? err.message : String(err);
  const status = supabaseStatus();

  if (!status.enabled) {
    return 'Database not configured on server. Set STORAGE_MODE=supabase, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY in Vercel, then Redeploy.';
  }
  if (/relation .* does not exist|Could not find the table/i.test(message)) {
    return 'Database tables missing. Run supabase/schema.sql in the Supabase SQL Editor.';
  }
  if (/Invalid API key|JWT|service_role|Unauthorized|permission denied/i.test(message)) {
    return 'Supabase service role key is invalid. Update SUPABASE_SERVICE_ROLE_KEY in Vercel and Redeploy.';
  }
  if (/ENOSPC|EROFS|EACCES|read-only|ENOENT|mkdir/i.test(message)) {
    return 'Server storage is misconfigured. Production must use STORAGE_MODE=supabase (not local JSON files).';
  }
  return `Login failed: ${message}`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email || '').trim().toLowerCase();
    const password = String(body.password || '').trim();

    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Production / Vercel must use Supabase — local JSON files are not writable there.
    if (process.env.VERCEL && !isSupabaseEnabled()) {
      return NextResponse.json(
        {
          error:
            'Database not configured on server. Set STORAGE_MODE=supabase, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY in Vercel → Settings → Environment Variables, then Redeploy.',
          storage: supabaseStatus(),
        },
        { status: 500 }
      );
    }

    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    if (!user.active) {
      return NextResponse.json({ error: 'This account is deactivated. Contact your admin.' }, { status: 403 });
    }
    if (!verifyUserPassword(user, password)) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    const token = createUserSessionToken(user.id, user.passwordHash);
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        features: user.features,
      },
    });
    setSessionCookies(response, token, user.id);
    return response;
  } catch (err) {
    console.error('[admin/login]', err);
    return NextResponse.json({ error: loginConfigErrorMessage(err) }, { status: 500 });
  }
}
