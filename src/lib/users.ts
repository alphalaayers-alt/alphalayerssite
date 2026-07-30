import { createHash, randomBytes, timingSafeEqual } from 'crypto';
import { createId, readJsonFile, writeJsonFile } from './storage';
import { getDefaultFeatures, type Feature, type Role } from './roles';
import { getSupabase, isSupabaseEnabled } from './supabase/client';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  features: Feature[];
  active: boolean;
  department?: string;
  phone?: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  passwordHash: string;
  salt: string;
}

export type SafeAdminUser = Omit<AdminUser, 'passwordHash' | 'salt'>;

const FILE = 'users.json';

function hashPassword(password: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${password}`).digest('hex');
}

export function toSafeUser(user: AdminUser): SafeAdminUser {
  const { passwordHash: _p, salt: _s, ...safe } = user;
  return safe;
}

function rowToUser(row: Record<string, unknown>): AdminUser {
  return {
    id: String(row.id),
    name: String(row.name),
    email: String(row.email),
    role: row.role as Role,
    features: Array.isArray(row.features) ? (row.features as Feature[]) : getDefaultFeatures(row.role as Role),
    active: Boolean(row.active),
    department: (row.department as string) || '',
    phone: (row.phone as string) || '',
    avatar: row.avatar as string | undefined,
    createdAt: String(row.created_at || row.createdAt || ''),
    updatedAt: String(row.updated_at || row.updatedAt || ''),
    createdBy: row.created_by as string | undefined,
    passwordHash: String(row.password_hash || row.passwordHash),
    salt: String(row.salt),
  };
}

function userToRow(user: AdminUser) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    features: user.features,
    active: user.active,
    department: user.department || '',
    phone: user.phone || '',
    avatar: user.avatar || null,
    created_at: user.createdAt,
    updated_at: user.updatedAt,
    created_by: user.createdBy || null,
    password_hash: user.passwordHash,
    salt: user.salt,
  };
}

async function seedSuperAdmin(): Promise<AdminUser> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { data: existing, error } = await sb
      .from('admin_users')
      .select('*')
      .eq('id', 'user-super-admin')
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (existing) return rowToUser(existing as Record<string, unknown>);
  } else {
    const users = await readJsonFile<AdminUser[]>(FILE, []);
    const existing = users.find((u) => u.id === 'user-super-admin');
    if (existing) return existing;
  }

  const salt = randomBytes(16).toString('hex');
  const password = process.env.ADMIN_PASSWORD || 'alphalayers';
  const now = new Date().toISOString();
  const user: AdminUser = {
    id: 'user-super-admin',
    name: 'Super Admin',
    email: 'admin@alphalayers.in',
    role: 'super_admin',
    features: getDefaultFeatures('super_admin'),
    active: true,
    department: 'Leadership',
    createdAt: now,
    updatedAt: now,
    salt,
    passwordHash: hashPassword(password, salt),
  };

  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error: insertError } = await sb.from('admin_users').insert(userToRow(user));
    if (insertError) throw new Error(insertError.message);
    return user;
  }

  await writeJsonFile(FILE, [user]);
  return user;
}

export async function getUsers(): Promise<AdminUser[]> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { data, error } = await sb.from('admin_users').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    if (!data || data.length === 0) {
      return [await seedSuperAdmin()];
    }
    return data.map((row) => rowToUser(row as Record<string, unknown>));
  }

  const users = await readJsonFile<AdminUser[]>(FILE, []);
  if (users.length === 0) {
    return [await seedSuperAdmin()];
  }
  return users;
}

export async function getUserById(id: string): Promise<AdminUser | null> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { data, error } = await sb.from('admin_users').select('*').eq('id', id).maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToUser(data as Record<string, unknown>) : null;
  }
  const users = await getUsers();
  return users.find((u) => u.id === id) || null;
}

export async function getUserByEmail(email: string): Promise<AdminUser | null> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { data, error } = await sb
      .from('admin_users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    if (error) throw new Error(error.message);
    return data ? rowToUser(data as Record<string, unknown>) : null;
  }
  const users = await getUsers();
  return users.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export function verifyUserPassword(user: AdminUser, password: string): boolean {
  if (!user.passwordHash || !user.salt) return false;
  const hash = hashPassword(password, user.salt);
  if (hash.length !== user.passwordHash.length) return false;
  try {
    return timingSafeEqual(Buffer.from(hash), Buffer.from(user.passwordHash));
  } catch {
    return false;
  }
}

export async function createUser(input: {
  name: string;
  email: string;
  password: string;
  role: Role;
  features?: Feature[];
  department?: string;
  phone?: string;
  createdBy?: string;
}): Promise<SafeAdminUser> {
  const existing = await getUserByEmail(input.email);
  if (existing) throw new Error('Email already exists');

  const salt = randomBytes(16).toString('hex');
  const now = new Date().toISOString();
  const user: AdminUser = {
    id: createId('user'),
    name: input.name.trim(),
    email: input.email.trim().toLowerCase(),
    role: input.role,
    features: input.features?.length ? input.features : getDefaultFeatures(input.role),
    active: true,
    department: input.department || '',
    phone: input.phone || '',
    createdAt: now,
    updatedAt: now,
    createdBy: input.createdBy,
    salt,
    passwordHash: hashPassword(input.password, salt),
  };

  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error } = await sb.from('admin_users').insert(userToRow(user));
    if (error) throw new Error(error.message);
    return toSafeUser(user);
  }

  const users = await getUsers();
  users.unshift(user);
  await writeJsonFile(FILE, users);
  return toSafeUser(user);
}

export async function updateUser(
  id: string,
  updates: Partial<{
    name: string;
    email: string;
    role: Role;
    features: Feature[];
    active: boolean;
    department: string;
    phone: string;
    password: string;
  }>
): Promise<SafeAdminUser | null> {
  const current = await getUserById(id);
  if (!current) return null;

  if (updates.email && updates.email.toLowerCase() !== current.email.toLowerCase()) {
    const clash = await getUserByEmail(updates.email);
    if (clash && clash.id !== id) throw new Error('Email already exists');
  }

  let salt = current.salt;
  let passwordHash = current.passwordHash;
  if (updates.password) {
    salt = randomBytes(16).toString('hex');
    passwordHash = hashPassword(updates.password, salt);
  }

  const next: AdminUser = {
    ...current,
    name: updates.name ?? current.name,
    email: updates.email ? updates.email.trim().toLowerCase() : current.email,
    role: updates.role ?? current.role,
    features: updates.features ?? current.features,
    active: updates.active ?? current.active,
    department: updates.department ?? current.department,
    phone: updates.phone ?? current.phone,
    salt,
    passwordHash,
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error } = await sb.from('admin_users').update(userToRow(next)).eq('id', id);
    if (error) throw new Error(error.message);
    return toSafeUser(next);
  }

  const users = await getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index < 0) return null;
  users[index] = next;
  await writeJsonFile(FILE, users);
  return toSafeUser(next);
}

export async function deleteUser(id: string): Promise<boolean> {
  if (id === 'user-super-admin') return false;

  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error, count } = await sb.from('admin_users').delete({ count: 'exact' }).eq('id', id);
    if (error) throw new Error(error.message);
    return (count || 0) > 0;
  }

  const users = await getUsers();
  const next = users.filter((u) => u.id !== id);
  if (next.length === users.length) return false;
  await writeJsonFile(FILE, next);
  return true;
}
