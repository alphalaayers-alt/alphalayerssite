import { createHash, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';
import { getUserById, toSafeUser, type SafeAdminUser } from './users';
import type { Feature } from './roles';

export const ADMIN_COOKIE = 'admin_session';
export const ADMIN_USER_COOKIE = 'admin_uid';

function getLegacySessionToken(): string {
  const password = process.env.ADMIN_PASSWORD || 'alphalayers';
  const secret = process.env.ADMIN_SECRET || 'change-me-in-production';
  return createHash('sha256').update(`${password}:${secret}`).digest('hex');
}

function getUserSessionToken(userId: string, passwordHash: string): string {
  const secret = process.env.ADMIN_SECRET || 'change-me-in-production';
  return createHash('sha256').update(`${userId}:${passwordHash}:${secret}`).digest('hex');
}

export function verifyPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || 'alphalayers';
  return password === expected;
}

export function createLegacySessionToken(): string {
  return getLegacySessionToken();
}

export function createUserSessionToken(userId: string, passwordHash: string): string {
  return getUserSessionToken(userId, passwordHash);
}

function safeEqual(a: string, b: string): boolean {
  try {
    return timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

export interface AdminSession {
  authenticated: boolean;
  user: SafeAdminUser | null;
  isLegacySuperAdmin: boolean;
}

export async function getAdminSession(): Promise<AdminSession> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  const userId = cookieStore.get(ADMIN_USER_COOKIE)?.value;

  if (!token) {
    return { authenticated: false, user: null, isLegacySuperAdmin: false };
  }

  // Legacy password-only super admin
  if (!userId || userId === 'legacy') {
    if (safeEqual(token, getLegacySessionToken())) {
      return {
        authenticated: true,
        user: {
          id: 'legacy-super-admin',
          name: 'Super Admin',
          email: 'admin@alphalayers.in',
          role: 'super_admin',
          features: [
            'overview',
            'website',
            'submissions',
            'blogs',
            'newsletter',
            'analytics',
            'team',
            'attendance',
            'notepad',
            'projects',
          ],
          active: true,
          department: 'Leadership',
          createdAt: '',
          updatedAt: '',
        },
        isLegacySuperAdmin: true,
      };
    }
    return { authenticated: false, user: null, isLegacySuperAdmin: false };
  }

  const user = await getUserById(userId);
  if (!user || !user.active) {
    return { authenticated: false, user: null, isLegacySuperAdmin: false };
  }

  const expected = getUserSessionToken(user.id, user.passwordHash);
  if (!safeEqual(token, expected)) {
    return { authenticated: false, user: null, isLegacySuperAdmin: false };
  }

  return {
    authenticated: true,
    user: toSafeUser(user),
    isLegacySuperAdmin: false,
  };
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const session = await getAdminSession();
  return session.authenticated;
}

export async function requireFeature(feature: Feature): Promise<AdminSession | null> {
  const session = await getAdminSession();
  if (!session.authenticated || !session.user) return null;
  if (session.user.role === 'super_admin') return session;
  if (!session.user.features.includes(feature)) return null;
  return session;
}

export function userHasFeature(user: SafeAdminUser | null | undefined, feature: Feature): boolean {
  if (!user) return false;
  if (user.role === 'super_admin') return true;
  return user.features.includes(feature);
}
