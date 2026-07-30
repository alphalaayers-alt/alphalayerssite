import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, ADMIN_USER_COOKIE, createUserSessionToken } from '@/lib/admin-auth';
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

    // Staff login with email + password
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
    return NextResponse.json({ error: 'Login failed. Check server logs.' }, { status: 500 });
  }
}
