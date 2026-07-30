import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, ADMIN_USER_COOKIE } from '@/lib/admin-auth';

export async function POST() {
  const response = NextResponse.json({ success: true });
  const opts = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
    maxAge: 0,
  };
  response.cookies.set(ADMIN_COOKIE, '', opts);
  response.cookies.set(ADMIN_USER_COOKIE, '', opts);
  return response;
}
