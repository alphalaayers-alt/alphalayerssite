'use client';

import React, { useEffect, useState } from 'react';
import { Pin, Plus, Trash2 } from 'lucide-react';
import { BentoButton, BentoCard, BentoInput, BentoTextarea, BentoTitle } from '@/components/admin/BentoUI';

interface NoteItem {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  updatedAt: string;
}

export function NotepadPanel() {
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [message, setMessage] = useState('');

  const load = async () => {
    const res = await fetch('/api/admin/notes');
    const data = await res.json();
    if (res.ok) {
      setNotes(data.notes || []);
      if (!selectedId && data.notes?.[0]) {
        setSelectedId(data.notes[0].id);
        setTitle(data.notes[0].title);
        setBody(data.notes[0].body);
      }
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectNote = (note: NoteItem) => {
    setSelectedId(note.id);
    setTitle(note.title);
    setBody(note.body);
  };

  const createNote = async () => {
    const res = await fetch('/api/admin/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New note', body: '' }),
    });
    const data = await res.json();
    if (res.ok) {
      await load();
      selectNote(data.note);
      setMessage('Note created');
    }
  };

  const saveNote = async () => {
    if (!selectedId) return;
    const res = await fetch('/api/admin/notes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selectedId, title, body }),
    });
    if (res.ok) {
      setMessage('Saved');
      await load();
    }
  };

  const togglePin = async (note: NoteItem) => {
    await fetch('/api/admin/notes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: note.id, pinned: !note.pinned }),
    });
    await load();
  };

  const removeNote = async (id: string) => {
    if (!confirm('Delete note?')) return;
    await fetch(`/api/admin/notes?id=${id}`, { method: 'DELETE' });
    if (selectedId === id) {
      setSelectedId(null);
      setTitle('');
      setBody('');
    }
    await load();
  };

  return (
    <section className="space-y-5">
      <BentoTitle
        title="Notepad"
        subtitle="Personal notes for tasks, meetings, and ideas"
        action={
          <BentoButton onClick={createNote}>
            <Plus className="w-4 h-4" />
            New Note
          </BentoButton>
        }
      />

      {message && (
        <BentoCard className="!py-3 !bg-[#2563eb]/10 !border-[#2563eb]/30">
          <p className="text-xs text-[#93c5fd]">{message}</p>
        </BentoCard>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <BentoCard className="xl:col-span-2 space-y-2 max-h-[36rem] overflow-y-auto">
          {notes.length === 0 ? (
            <p className="text-sm text-slate-400 py-8 text-center">No notes yet.</p>
          ) : (
            notes.map((note) => (
              <button
                key={note.id}
                onClick={() => selectNote(note)}
                className={`w-full text-left rounded-2xl border p-3 transition ${
                  selectedId === note.id
                    ? 'border-[#2563eb]/50 bg-[#2563eb]/10'
                    : 'border-white/8 bg-[#0d151c]/40 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm truncate">{note.title}</p>
                  {note.pinned && <Pin className="w-3.5 h-3.5 text-[#60a5fa]" />}
                </div>
                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">{note.body || 'Empty note'}</p>
              </button>
            ))
          )}
        </BentoCard>

        <BentoCard className="xl:col-span-3 space-y-3 min-h-[24rem]">
          {selectedId ? (
            <>
              <BentoInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
              <BentoTextarea
                rows={14}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your notes..."
              />
              <div className="flex flex-wrap gap-2">
                <BentoButton onClick={saveNote}>Save</BentoButton>
                <BentoButton
                  variant="ghost"
                  onClick={() => {
                    const note = notes.find((n) => n.id === selectedId);
                    if (note) togglePin(note);
                  }}
                >
                  <Pin className="w-4 h-4" />
                  Pin
                </BentoButton>
                <BentoButton variant="danger" onClick={() => removeNote(selectedId)}>
                  <Trash2 className="w-4 h-4" />
                  Delete
                </BentoButton>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-400 py-16 text-center">Select or create a note.</p>
          )}
        </BentoCard>
      </div>
    </section>
  );
}
