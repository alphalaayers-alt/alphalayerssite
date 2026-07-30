import { NextResponse } from 'next/server';
import { getAdminSession, requireFeature } from '@/lib/admin-auth';
import {
  FEATURES,
  ROLE_LABELS,
  ROLES,
  canCreateRole,
  canManageUsers,
  getDefaultFeatures,
  type Feature,
  type Role,
} from '@/lib/roles';
import { createUser, deleteUser, getUsers, toSafeUser, updateUser } from '@/lib/users';

export async function GET() {
  const session = await requireFeature('team');
  if (!session) {
    // Users with attendance can still see a lightweight self profile via session;
    // team list requires team permission.
    const any = await getAdminSession();
    if (!any.authenticated) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: 'No access to team management' }, { status: 403 });
  }

  const users = await getUsers();
  return NextResponse.json({
    users: users.map(toSafeUser),
    roles: ROLES.map((id) => ({ id, label: ROLE_LABELS[id], defaults: getDefaultFeatures(id) })),
    features: FEATURES,
  });
}

export async function POST(request: Request) {
  const session = await requireFeature('team');
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!canManageUsers(session.user.role)) {
    return NextResponse.json({ error: 'You cannot manage users' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const role = body.role as Role;
    if (!ROLES.includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 });
    }
    if (!canCreateRole(session.user.role, role)) {
      return NextResponse.json({ error: 'You cannot create this role' }, { status: 403 });
    }
    if (!body.name || !body.email || !body.password) {
      return NextResponse.json({ error: 'Name, email and password are required' }, { status: 400 });
    }

    const features = Array.isArray(body.features)
      ? (body.features.filter((f: string) => FEATURES.includes(f as Feature)) as Feature[])
      : getDefaultFeatures(role);

    const user = await createUser({
      name: body.name,
      email: body.email,
      password: body.password,
      role,
      features,
      department: body.department,
      phone: body.phone,
      createdBy: session.user.id,
    });

    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to create user' },
      { status: 400 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await requireFeature('team');
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (!canManageUsers(session.user.role)) {
    return NextResponse.json({ error: 'You cannot manage users' }, { status: 403 });
  }

  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'User id required' }, { status: 400 });

    if (body.role && !canCreateRole(session.user.role, body.role as Role)) {
      return NextResponse.json({ error: 'You cannot assign this role' }, { status: 403 });
    }

    const features = Array.isArray(body.features)
      ? (body.features.filter((f: string) => FEATURES.includes(f as Feature)) as Feature[])
      : undefined;

    const user = await updateUser(body.id, {
      name: body.name,
      email: body.email,
      role: body.role,
      features,
      active: body.active,
      department: body.department,
      phone: body.phone,
      password: body.password || undefined,
    });

    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Failed to update user' },
      { status: 400 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await requireFeature('team');
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  if (session.user.role !== 'super_admin' && session.user.role !== 'manager') {
    return NextResponse.json({ error: 'Only managers can delete users' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'User id required' }, { status: 400 });
  if (id === session.user.id) {
    return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
  }

  const ok = await deleteUser(id);
  if (!ok) return NextResponse.json({ error: 'User not found or protected' }, { status: 404 });
  return NextResponse.json({ success: true });
}
