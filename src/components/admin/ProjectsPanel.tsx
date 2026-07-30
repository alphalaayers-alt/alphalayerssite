'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { BentoButton, BentoCard, BentoInput, BentoTextarea, BentoTitle } from '@/components/admin/BentoUI';
import type { ProjectItem, ProjectStatus, TaskStatus } from '@/lib/projects';

interface Member {
  id: string;
  name: string;
}

export function ProjectsPanel({ currentUserId }: { currentUserId: string }) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'planned' as ProjectStatus,
    priority: 'medium' as 'low' | 'medium' | 'high',
    dueDate: '',
  });
  const [taskTitle, setTaskTitle] = useState('');

  const selected = projects.find((p) => p.id === selectedId) || null;

  const load = async () => {
    const [pRes, mRes] = await Promise.all([
      fetch('/api/admin/projects'),
      fetch('/api/admin/members'),
    ]);
    const pData = await pRes.json();
    const mData = await mRes.json();
    if (pRes.ok) setProjects(pData.projects || []);
    if (mRes.ok) setMembers(mData.members || []);
  };

  useEffect(() => {
    load();
  }, []);

  const createProject = async () => {
    if (!form.title.trim()) return;
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, memberIds: [currentUserId] }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Failed');
      return;
    }
    setForm({ title: '', description: '', status: 'planned', priority: 'medium', dueDate: '' });
    setMessage('Project created');
    await load();
    setSelectedId(data.project.id);
  };

  const updateProject = async (patch: Partial<ProjectItem>) => {
    if (!selected) return;
    const res = await fetch('/api/admin/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: selected.id, ...patch }),
    });
    if (res.ok) {
      await load();
      setMessage('Project updated');
    }
  };

  const addTask = async () => {
    if (!selected || !taskTitle.trim()) return;
    const res = await fetch('/api/admin/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_task', projectId: selected.id, title: taskTitle }),
    });
    if (res.ok) {
      setTaskTitle('');
      await load();
    }
  };

  const setTaskStatus = async (taskId: string, status: TaskStatus) => {
    if (!selected) return;
    await fetch('/api/admin/projects', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'update_task', projectId: selected.id, taskId, status }),
    });
    await load();
  };

  const removeProject = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await fetch(`/api/admin/projects?id=${id}`, { method: 'DELETE' });
    if (selectedId === id) setSelectedId(null);
    await load();
  };

  const statusColor: Record<ProjectStatus, string> = {
    planned: 'bg-slate-500/20 text-slate-300',
    in_progress: 'bg-blue-500/20 text-blue-300',
    blocked: 'bg-red-500/20 text-red-300',
    done: 'bg-emerald-500/20 text-emerald-300',
  };

  return (
    <section className="space-y-5">
      <BentoTitle
        title="Project Tracker"
        subtitle="Manage projects, assign members, and track tasks in one place"
      />

      {message && (
        <BentoCard className="!py-3 !bg-[#2563eb]/10 !border-[#2563eb]/30">
          <p className="text-xs text-[#93c5fd]">{message}</p>
        </BentoCard>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <BentoCard className="xl:col-span-2 space-y-4">
          <h3 className="font-bold text-lg">New Project</h3>
          <BentoInput
            placeholder="Project title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <BentoTextarea
            rows={3}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as ProjectStatus })}
              className="bg-[#0d151c]/80 border border-white/10 rounded-2xl px-3 py-2.5 text-sm"
            >
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="blocked">Blocked</option>
              <option value="done">Done</option>
            </select>
            <select
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as 'low' | 'medium' | 'high' })}
              className="bg-[#0d151c]/80 border border-white/10 rounded-2xl px-3 py-2.5 text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <BentoInput
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
          />
          <BentoButton onClick={createProject}>
            <Plus className="w-4 h-4" />
            Create Project
          </BentoButton>

          <div className="pt-2 space-y-2 max-h-80 overflow-y-auto">
            {projects.map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedId(p.id)}
                className={`w-full text-left rounded-2xl border p-3 ${
                  selectedId === p.id
                    ? 'border-[#2563eb]/50 bg-[#2563eb]/10'
                    : 'border-white/8 bg-[#0d151c]/40'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <p className="font-semibold text-sm">{p.title}</p>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg ${statusColor[p.status]}`}>
                    {p.status.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {p.tasks.filter((t) => t.status === 'done').length}/{p.tasks.length} tasks · {p.priority}
                </p>
              </button>
            ))}
          </div>
        </BentoCard>

        <BentoCard className="xl:col-span-3 space-y-4">
          {!selected ? (
            <p className="text-sm text-slate-400 py-16 text-center">Select a project to track tasks.</p>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-bold text-xl">{selected.title}</h3>
                  <p className="text-sm text-slate-400 mt-1">{selected.description || 'No description'}</p>
                </div>
                <BentoButton variant="danger" className="!py-1.5 !px-2" onClick={() => removeProject(selected.id)}>
                  <Trash2 className="w-4 h-4" />
                </BentoButton>
              </div>

              <div className="flex flex-wrap gap-2">
                {(['planned', 'in_progress', 'blocked', 'done'] as ProjectStatus[]).map((s) => (
                  <BentoButton
                    key={s}
                    variant={selected.status === s ? 'primary' : 'ghost'}
                    className="!text-xs"
                    onClick={() => updateProject({ status: s })}
                  >
                    {s.replace('_', ' ')}
                  </BentoButton>
                ))}
              </div>

              <div>
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold mb-2">Members</p>
                <div className="flex flex-wrap gap-2">
                  {members.map((m) => {
                    const on = selected.memberIds.includes(m.id) || selected.ownerId === m.id;
                    return (
                      <button
                        key={m.id}
                        onClick={() => {
                          const set = new Set(selected.memberIds);
                          if (on && m.id !== selected.ownerId) set.delete(m.id);
                          else set.add(m.id);
                          updateProject({ memberIds: Array.from(set) });
                        }}
                        className={`text-xs px-3 py-1.5 rounded-2xl border ${
                          on
                            ? 'bg-[#2563eb]/20 border-[#2563eb]/40 text-[#93c5fd]'
                            : 'border-white/10 text-slate-400'
                        }`}
                      >
                        {m.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">Tasks</p>
                <div className="flex gap-2">
                  <BentoInput
                    placeholder="Add a task..."
                    value={taskTitle}
                    onChange={(e) => setTaskTitle(e.target.value)}
                  />
                  <BentoButton onClick={addTask} className="shrink-0">
                    Add
                  </BentoButton>
                </div>
                <div className="space-y-2 max-h-72 overflow-y-auto">
                  {selected.tasks.length === 0 ? (
                    <p className="text-sm text-slate-500">No tasks yet.</p>
                  ) : (
                    selected.tasks.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between gap-2 rounded-2xl border border-white/8 bg-[#0d151c]/50 px-3 py-2.5"
                      >
                        <p className="text-sm">{t.title}</p>
                        <select
                          value={t.status}
                          onChange={(e) => setTaskStatus(t.id, e.target.value as TaskStatus)}
                          className="bg-[#18232c] border border-white/10 rounded-xl px-2 py-1 text-xs"
                        >
                          <option value="todo">To Do</option>
                          <option value="doing">Doing</option>
                          <option value="done">Done</option>
                        </select>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </BentoCard>
      </div>
    </section>
  );
}
