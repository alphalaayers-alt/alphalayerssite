import { NextResponse } from 'next/server';
import { requireFeature } from '@/lib/admin-auth';
import { createNote, deleteNote, getNotesForUser, updateNote } from '@/lib/notes';

export async function GET() {
  const session = await requireFeature('notepad');
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const notes = await getNotesForUser(session.user.id);
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  const session = await requireFeature('notepad');
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    const note = await createNote({
      userId: session.user.id,
      title: String(body.title || 'Untitled'),
      body: String(body.body || ''),
    });
    return NextResponse.json({ note });
  } catch {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const session = await requireFeature('notepad');
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await request.json();
    if (!body.id) return NextResponse.json({ error: 'id required' }, { status: 400 });
    const note = await updateNote(body.id, session.user.id, {
      title: body.title,
      body: body.body,
      pinned: body.pinned,
    });
    if (!note) return NextResponse.json({ error: 'Note not found' }, { status: 404 });
    return NextResponse.json({ note });
  } catch {
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const session = await requireFeature('notepad');
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 });

  const ok = await deleteNote(id, session.user.id);
  if (!ok) return NextResponse.json({ error: 'Note not found' }, { status: 404 });
  return NextResponse.json({ success: true });
}
