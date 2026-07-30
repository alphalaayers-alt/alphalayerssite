import { createId, readJsonFile, writeJsonFile } from './storage';
import { getSupabase, isSupabaseEnabled } from './supabase/client';

export interface NoteItem {
  id: string;
  userId: string;
  title: string;
  body: string;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
}

const FILE = 'notes.json';

function fromRow(row: Record<string, unknown>): NoteItem {
  return {
    id: String(row.id),
    userId: String(row.user_id || row.userId),
    title: String(row.title || 'Untitled'),
    body: String(row.body || ''),
    pinned: Boolean(row.pinned),
    createdAt: String(row.created_at || row.createdAt || ''),
    updatedAt: String(row.updated_at || row.updatedAt || ''),
  };
}

export async function getNotes(): Promise<NoteItem[]> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { data, error } = await sb.from('notes').select('*').order('updated_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map((r) => fromRow(r as Record<string, unknown>));
  }
  return readJsonFile<NoteItem[]>(FILE, []);
}

export async function getNotesForUser(userId: string): Promise<NoteItem[]> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { data, error } = await sb
      .from('notes')
      .select('*')
      .eq('user_id', userId)
      .order('pinned', { ascending: false })
      .order('updated_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map((r) => fromRow(r as Record<string, unknown>));
  }

  const notes = await getNotes();
  return notes
    .filter((n) => n.userId === userId)
    .sort((a, b) => Number(b.pinned) - Number(a.pinned) || b.updatedAt.localeCompare(a.updatedAt));
}

export async function createNote(input: {
  userId: string;
  title: string;
  body: string;
}): Promise<NoteItem> {
  const now = new Date().toISOString();
  const note: NoteItem = {
    id: createId('note'),
    userId: input.userId,
    title: input.title.trim() || 'Untitled',
    body: input.body,
    pinned: false,
    createdAt: now,
    updatedAt: now,
  };

  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error } = await sb.from('notes').insert({
      id: note.id,
      user_id: note.userId,
      title: note.title,
      body: note.body,
      pinned: false,
      created_at: note.createdAt,
      updated_at: note.updatedAt,
    });
    if (error) throw new Error(error.message);
    return note;
  }

  const notes = await getNotes();
  notes.unshift(note);
  await writeJsonFile(FILE, notes);
  return note;
}

export async function updateNote(
  id: string,
  userId: string,
  updates: Partial<Pick<NoteItem, 'title' | 'body' | 'pinned'>>,
  allowAny = false
): Promise<NoteItem | null> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    let query = sb.from('notes').select('*').eq('id', id);
    if (!allowAny) query = query.eq('user_id', userId);
    const { data: existing } = await query.maybeSingle();
    if (!existing) return null;
    const next = {
      title: updates.title ?? existing.title,
      body: updates.body ?? existing.body,
      pinned: updates.pinned ?? existing.pinned,
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await sb.from('notes').update(next).eq('id', id).select('*').single();
    if (error) throw new Error(error.message);
    return fromRow(data as Record<string, unknown>);
  }

  const notes = await getNotes();
  const index = notes.findIndex((n) => n.id === id && (allowAny || n.userId === userId));
  if (index < 0) return null;
  notes[index] = {
    ...notes[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  await writeJsonFile(FILE, notes);
  return notes[index];
}

export async function deleteNote(id: string, userId: string, allowAny = false): Promise<boolean> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    let query = sb.from('notes').delete({ count: 'exact' }).eq('id', id);
    if (!allowAny) query = query.eq('user_id', userId);
    const { error, count } = await query;
    if (error) throw new Error(error.message);
    return (count || 0) > 0;
  }

  const notes = await getNotes();
  const next = notes.filter((n) => !(n.id === id && (allowAny || n.userId === userId)));
  if (next.length === notes.length) return false;
  await writeJsonFile(FILE, next);
  return true;
}
