'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { BentoButton, BentoCard, BentoTitle } from '@/components/admin/BentoUI';
import type { AttendanceStatus } from '@/lib/attendance';
import type { Role } from '@/lib/roles';

interface RecordItem {
  id: string;
  userId: string;
  date: string;
  status: AttendanceStatus;
  note?: string;
}

interface Member {
  id: string;
  name: string;
  role: Role;
}

const STATUS_COLORS: Record<AttendanceStatus, string> = {
  present: 'bg-emerald-500/80 text-white',
  absent: 'bg-red-500/80 text-white',
  leave: 'bg-amber-500/80 text-white',
  half_day: 'bg-sky-500/80 text-white',
  remote: 'bg-violet-500/80 text-white',
};

function monthKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function AttendancePanel({
  currentUserId,
  currentRole,
}: {
  currentUserId: string;
  currentRole: Role;
}) {
  const canManage = ['super_admin', 'manager', 'hr'].includes(currentRole);
  const [cursor, setCursor] = useState(() => new Date());
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedUserId, setSelectedUserId] = useState(currentUserId);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [status, setStatus] = useState<AttendanceStatus>('present');
  const [note, setNote] = useState('');
  const [message, setMessage] = useState('');

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const key = monthKey(cursor);

  const load = async () => {
    const qs = canManage
      ? `userId=${selectedUserId}&month=${key}`
      : `month=${key}`;
    const [attRes, memRes] = await Promise.all([
      fetch(`/api/admin/attendance?${qs}`),
      canManage ? fetch('/api/admin/members') : Promise.resolve(null),
    ]);
    const attData = await attRes.json();
    if (attRes.ok) setRecords(attData.records || []);
    if (memRes) {
      const memData = await memRes.json();
      if (memRes.ok) setMembers(memData.members || []);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, selectedUserId, canManage]);

  const byDate = useMemo(() => {
    const map = new Map<string, RecordItem>();
    records.forEach((r) => map.set(r.date, r));
    return map;
  }, [records]);

  const firstDow = new Date(year, month, 1).getDay();
  const totalDays = daysInMonth(year, month);
  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: totalDays }, (_, i) => i + 1),
  ];

  const saveDay = async () => {
    if (!selectedDate) return;
    setMessage('');
    const res = await fetch('/api/admin/attendance', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: selectedUserId,
        date: selectedDate,
        status,
        note,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Failed');
      return;
    }
    setMessage('Attendance saved');
    setSelectedDate(null);
    await load();
  };

  return (
    <section className="space-y-5">
      <BentoTitle
        title="Attendance Calendar"
        subtitle="Mark and track daily attendance across the month"
        action={
          <div className="flex items-center gap-2">
            <BentoButton
              variant="ghost"
              className="!px-2"
              onClick={() => setCursor(new Date(year, month - 1, 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </BentoButton>
            <span className="text-sm font-semibold min-w-[9rem] text-center">
              {cursor.toLocaleString('en-US', { month: 'long', year: 'numeric' })}
            </span>
            <BentoButton
              variant="ghost"
              className="!px-2"
              onClick={() => setCursor(new Date(year, month + 1, 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </BentoButton>
          </div>
        }
      />

      {canManage && (
        <BentoCard className="!py-3">
          <label className="text-xs text-slate-400 block mb-2">Employee</label>
          <select
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="w-full sm:w-80 bg-[#0d151c]/80 border border-white/10 rounded-2xl px-4 py-2.5 text-sm"
          >
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
            {!members.find((m) => m.id === currentUserId) && (
              <option value={currentUserId}>Me</option>
            )}
          </select>
        </BentoCard>
      )}

      {message && (
        <BentoCard className="!py-3 !bg-[#2563eb]/10 !border-[#2563eb]/30">
          <p className="text-xs text-[#93c5fd]">{message}</p>
        </BentoCard>
      )}

      <BentoCard>
        <div className="grid grid-cols-7 gap-2 mb-3 text-[11px] text-slate-500 font-semibold text-center">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d}>{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {cells.map((day, idx) => {
            if (!day) return <div key={`e-${idx}`} />;
            const date = `${key}-${String(day).padStart(2, '0')}`;
            const rec = byDate.get(date);
            return (
              <button
                key={date}
                onClick={() => {
                  setSelectedDate(date);
                  setStatus(rec?.status || 'present');
                  setNote(rec?.note || '');
                }}
                className={`min-h-[4.5rem] rounded-2xl border border-white/8 p-2 text-left transition hover:border-[#2563eb]/50 ${
                  selectedDate === date ? 'ring-2 ring-[#2563eb]' : 'bg-[#0d151c]/40'
                }`}
              >
                <div className="text-xs font-semibold mb-1">{day}</div>
                {rec && (
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-lg ${STATUS_COLORS[rec.status]}`}>
                    {rec.status.replace('_', ' ')}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap gap-2 mt-4 text-[11px] text-slate-400">
          {Object.entries(STATUS_COLORS).map(([k, cls]) => (
            <span key={k} className={`px-2 py-1 rounded-lg ${cls}`}>
              {k.replace('_', ' ')}
            </span>
          ))}
        </div>
      </BentoCard>

      {selectedDate && (
        <BentoCard className="space-y-3">
          <h3 className="font-bold">Mark {selectedDate}</h3>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(STATUS_COLORS) as AttendanceStatus[]).map((s) => (
              <BentoButton
                key={s}
                variant={status === s ? 'primary' : 'ghost'}
                className="!text-xs"
                onClick={() => setStatus(s)}
              >
                {s.replace('_', ' ')}
              </BentoButton>
            ))}
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Optional note"
            rows={2}
            className="w-full bg-[#0d151c]/80 border border-white/10 rounded-2xl px-4 py-3 text-sm"
          />
          <div className="flex gap-2">
            <BentoButton onClick={saveDay}>Save Attendance</BentoButton>
            <BentoButton variant="ghost" onClick={() => setSelectedDate(null)}>
              Close
            </BentoButton>
          </div>
        </BentoCard>
      )}
    </section>
  );
}
