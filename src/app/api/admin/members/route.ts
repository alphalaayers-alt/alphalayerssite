import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { getUsers, toSafeUser } from '@/lib/users';

/** Lightweight member list for assigning projects / attendance (authenticated). */
export async function GET() {
  const session = await getAdminSession();
  if (!session.authenticated) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const users = await getUsers();
  return NextResponse.json({
    members: users.filter((u) => u.active).map((u) => {
      const safe = toSafeUser(u);
      return {
        id: safe.id,
        name: safe.name,
        email: safe.email,
        role: safe.role,
        department: safe.department,
      };
    }),
  });
}
