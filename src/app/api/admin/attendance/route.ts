import { NextResponse } from 'next/server';
import { requireFeature } from '@/lib/admin-auth';
import { getAttendance, getAttendanceForUser, upsertAttendance, type AttendanceStatus } from '@/lib/attendance';

export async function GET(request: Request) {
  const session = await requireFeature('attendance');
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const month = searchParams.get('month') || undefined;
  const userId = searchParams.get('userId') || session.user.id;
  const canViewAll = ['super_admin', 'manager', 'hr'].includes(session.user.role);

  if (!canViewAll && userId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  if (canViewAll && searchParams.get('all') === '1') {
    const records = await getAttendance();
    return NextResponse.json({
      records: month ? records.filter((r) => r.date.startsWith(month)) : records,
    });
  }

  const records = await getAttendanceForUser(userId, month);
  return NextResponse.json({ records });
}

export async function POST(request: Request) {
  const session = await requireFeature('attendance');
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const canManage = ['super_admin', 'manager', 'hr'].includes(session.user.role);
    const userId = body.userId || session.user.id;

    if (!canManage && userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    if (!body.date || !body.status) {
      return NextResponse.json({ error: 'date and status are required' }, { status: 400 });
    }

    const record = await upsertAttendance({
      userId,
      date: String(body.date),
      status: body.status as AttendanceStatus,
      note: body.note,
      markedBy: session.user.id,
    });

    return NextResponse.json({ record });
  } catch {
    return NextResponse.json({ error: 'Failed to save attendance' }, { status: 500 });
  }
}
