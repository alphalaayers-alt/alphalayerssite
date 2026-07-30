import { createId, readJsonFile, writeJsonFile } from './storage';
import { getSupabase, isSupabaseEnabled } from './supabase/client';

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'half_day' | 'remote';

export interface AttendanceRecord {
  id: string;
  userId: string;
  date: string;
  status: AttendanceStatus;
  note?: string;
  markedBy?: string;
  createdAt: string;
  updatedAt: string;
}

const FILE = 'attendance.json';

function fromRow(row: Record<string, unknown>): AttendanceRecord {
  return {
    id: String(row.id),
    userId: String(row.user_id || row.userId),
    date: String(row.date).slice(0, 10),
    status: row.status as AttendanceStatus,
    note: (row.note as string) || '',
    markedBy: (row.marked_by as string) || undefined,
    createdAt: String(row.created_at || row.createdAt || ''),
    updatedAt: String(row.updated_at || row.updatedAt || ''),
  };
}

export async function getAttendance(): Promise<AttendanceRecord[]> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { data, error } = await sb.from('attendance').select('*').order('date', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map((r) => fromRow(r as Record<string, unknown>));
  }
  return readJsonFile<AttendanceRecord[]>(FILE, []);
}

export async function getAttendanceForUser(userId: string, month?: string): Promise<AttendanceRecord[]> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    let query = sb.from('attendance').select('*').eq('user_id', userId);
    if (month) {
      query = query.gte('date', `${month}-01`).lte('date', `${month}-31`);
    }
    const { data, error } = await query.order('date', { ascending: true });
    if (error) throw new Error(error.message);
    return (data || []).map((r) => fromRow(r as Record<string, unknown>));
  }

  const all = await getAttendance();
  return all.filter((r) => {
    if (r.userId !== userId) return false;
    if (month && !r.date.startsWith(month)) return false;
    return true;
  });
}

export async function upsertAttendance(input: {
  userId: string;
  date: string;
  status: AttendanceStatus;
  note?: string;
  markedBy?: string;
}): Promise<AttendanceRecord> {
  const now = new Date().toISOString();

  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { data: existing } = await sb
      .from('attendance')
      .select('*')
      .eq('user_id', input.userId)
      .eq('date', input.date)
      .maybeSingle();

    if (existing) {
      const { data, error } = await sb
        .from('attendance')
        .update({
          status: input.status,
          note: input.note ?? existing.note,
          marked_by: input.markedBy || null,
          updated_at: now,
        })
        .eq('id', existing.id)
        .select('*')
        .single();
      if (error) throw new Error(error.message);
      return fromRow(data as Record<string, unknown>);
    }

    const record: AttendanceRecord = {
      id: createId('att'),
      userId: input.userId,
      date: input.date,
      status: input.status,
      note: input.note || '',
      markedBy: input.markedBy,
      createdAt: now,
      updatedAt: now,
    };
    const { error } = await sb.from('attendance').insert({
      id: record.id,
      user_id: record.userId,
      date: record.date,
      status: record.status,
      note: record.note,
      marked_by: record.markedBy || null,
      created_at: record.createdAt,
      updated_at: record.updatedAt,
    });
    if (error) throw new Error(error.message);
    return record;
  }

  const all = await getAttendance();
  const index = all.findIndex((r) => r.userId === input.userId && r.date === input.date);
  if (index >= 0) {
    all[index] = {
      ...all[index],
      status: input.status,
      note: input.note ?? all[index].note,
      markedBy: input.markedBy,
      updatedAt: now,
    };
    await writeJsonFile(FILE, all);
    return all[index];
  }

  const record: AttendanceRecord = {
    id: createId('att'),
    userId: input.userId,
    date: input.date,
    status: input.status,
    note: input.note || '',
    markedBy: input.markedBy,
    createdAt: now,
    updatedAt: now,
  };
  all.push(record);
  await writeJsonFile(FILE, all);
  return record;
}
