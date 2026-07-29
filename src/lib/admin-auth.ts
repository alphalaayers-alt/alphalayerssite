import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const ADMIN_COOKIE = 'admin_session';

function getSessionToken(): string {
  const password = process.env.ADMIN_PASSWORD || 'alphalayers';
  const secret = process.env.ADMIN_SECRET || 'change-me-in-production';
  return createHash('sha256').update(`${password}:${secret}`).digest('hex');
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || 'alphalayers';
  return password === expected;
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;
  const expected = getSessionToken();
  try {
    return timingSafeEqual(Buffer.from(token), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  return verifySessionToken(token);
}

export function createSessionToken(): string {
  return getSessionToken();
}
