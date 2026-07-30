'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Save, Trash2, UserPlus } from 'lucide-react';
import {
  BentoButton,
  BentoCard,
  BentoInput,
  BentoTitle,
} from '@/components/admin/BentoUI';
import {
  FEATURES,
  FEATURE_LABELS,
  ROLE_LABELS,
  ROLES,
  canCreateRole,
  getDefaultFeatures,
  type Feature,
  type Role,
} from '@/lib/roles';

interface SafeUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  features: Feature[];
  active: boolean;
  department?: string;
  phone?: string;
}

interface Props {
  currentRole: Role;
  onChanged?: () => void;
}

export function TeamManager({ currentRole, onChanged }: Props) {
  const [users, setUsers] = useState<SafeUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee' as Role,
    department: '',
    phone: '',
    features: getDefaultFeatures('employee') as Feature[],
  });

  const creatableRoles = useMemo(
    () => ROLES.filter((r) => canCreateRole(currentRole, r)),
    [currentRole]
  );

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users');
      const data = await res.json();
      if (res.ok) setUsers(data.users || []);
      else setMessage(data.error || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resetForm = (role: Role = 'employee') => {
    setEditingId(null);
    setForm({
      name: '',
      email: '',
      password: '',
      role,
      department: '',
      phone: '',
      features: getDefaultFeatures(role),
    });
  };

  const onRoleChange = (role: Role) => {
    setForm((f) => ({ ...f, role, features: getDefaultFeatures(role) }));
  };

  const toggleFeature = (feature: Feature) => {
    setForm((f) => ({
      ...f,
      features: f.features.includes(feature)
        ? f.features.filter((x) => x !== feature)
        : [...f.features, feature],
    }));
  };

  const save = async () => {
    setMessage('');
    if (!form.name || !form.email || (!editingId && !form.password)) {
      setMessage('Name, email and password are required for new users.');
      return;
    }

    const res = await fetch('/api/admin/users', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(editingId ? { id: editingId, ...form } : form),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Save failed');
      return;
    }
    setMessage(editingId ? 'User updated' : 'User created');
    resetForm();
    await load();
    onChanged?.();
  };

  const editUser = (user: SafeUser) => {
    setEditingId(user.id);
    setForm({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
      department: user.department || '',
      phone: user.phone || '',
      features: user.features,
    });
  };

  const removeUser = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    const res = await fetch(`/api/admin/users?id=${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || 'Delete failed');
      return;
    }
    await load();
    onChanged?.();
  };

  return (
    <section className="space-y-5">
      <BentoTitle
        title="Team & Users"
        subtitle="Create employees by role and control dashboard feature access"
      />

      {message && (
        <BentoCard className="!py-3 !bg-[#2563eb]/10 !border-[#2563eb]/30">
          <p className="text-xs text-[#93c5fd]">{message}</p>
        </BentoCard>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
        <BentoCard className="xl:col-span-3 space-y-4">
          <h3 className="font-bold text-lg flex items-center gap-2">
            <UserPlus className="w-4 h-4 text-[#60a5fa]" />
            {editingId ? 'Edit User' : 'Create User Profile'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <BentoInput
              placeholder="Full name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <BentoInput
              placeholder="Email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <BentoInput
              placeholder={editingId ? 'New password (optional)' : 'Password'}
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <select
              value={form.role}
              onChange={(e) => onRoleChange(e.target.value as Role)}
              className="w-full bg-[#0d151c]/80 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white"
            >
              {creatableRoles.map((r) => (
                <option key={r} value={r}>
                  {ROLE_LABELS[r]}
                </option>
              ))}
            </select>
            <BentoInput
              placeholder="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />
            <BentoInput
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <p className="text-[11px] uppercase tracking-wider text-slate-500 font-semibold">
              Feature Access (defaults for {ROLE_LABELS[form.role]})
            </p>
            <p className="text-xs text-slate-400">
              Check or uncheck to grant/deny access. Role defaults are applied when you change role.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {FEATURES.map((feature) => (
                <label
                  key={feature}
                  className="flex items-center justify-between gap-2 rounded-2xl border border-white/8 bg-[#0d151c]/50 px-3 py-2.5 text-sm"
                >
                  <span>{FEATURE_LABELS[feature]}</span>
                  <input
                    type="checkbox"
                    checked={form.features.includes(feature)}
                    onChange={() => toggleFeature(feature)}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <BentoButton onClick={save}>
              <Save className="w-4 h-4" />
              {editingId ? 'Update User' : 'Create User'}
            </BentoButton>
            {editingId && (
              <BentoButton variant="ghost" onClick={() => resetForm()}>
                Cancel
              </BentoButton>
            )}
          </div>
        </BentoCard>

        <BentoCard className="xl:col-span-2 space-y-3">
          <h3 className="font-bold text-lg">Company Directory</h3>
          {loading ? (
            <p className="text-sm text-slate-400">Loading...</p>
          ) : users.length === 0 ? (
            <p className="text-sm text-slate-400">No users yet.</p>
          ) : (
            <div className="space-y-2 max-h-[36rem] overflow-y-auto">
              {users.map((user) => (
                <div key={user.id} className="rounded-2xl border border-white/8 bg-[#0d151c]/50 p-3 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-[11px] text-slate-400">
                        {ROLE_LABELS[user.role]} · {user.email}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Access: {user.features.map((f) => FEATURE_LABELS[f]).join(', ')}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-xl ${
                        user.active
                          ? 'bg-green-500/10 text-green-400'
                          : 'bg-red-500/10 text-red-300'
                      }`}
                    >
                      {user.active ? 'Active' : 'Off'}
                    </span>
                  </div>
                  <div className="flex gap-1">
                    <BentoButton variant="ghost" className="!py-1 !px-2 !text-[11px]" onClick={() => editUser(user)}>
                      Edit
                    </BentoButton>
                    <BentoButton
                      variant="soft"
                      className="!py-1 !px-2 !text-[11px]"
                      onClick={async () => {
                        await fetch('/api/admin/users', {
                          method: 'PUT',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ id: user.id, active: !user.active }),
                        });
                        await load();
                      }}
                    >
                      {user.active ? 'Disable' : 'Enable'}
                    </BentoButton>
                    {user.id !== 'user-super-admin' && (
                      <BentoButton
                        variant="danger"
                        className="!py-1 !px-2 !text-[11px]"
                        onClick={() => removeUser(user.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </BentoButton>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </BentoCard>
      </div>
    </section>
  );
}
