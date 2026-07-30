/**
 * Reset all admin users and create a single super admin.
 * Usage (do not commit credentials):
 *   SUPERADMIN_EMAIL=you@example.com SUPERADMIN_PASSWORD=secret npx tsx scripts/seed-superadmin.ts
 *   RESET_ALL=true npx tsx scripts/seed-superadmin.ts  # deletes every admin user first
 */
import { createHash, randomBytes } from 'crypto';
import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { resolve } from 'path';
import { writeFileSync } from 'fs';

config({ path: resolve(process.cwd(), '.env.local') });

const FEATURES = [
  'overview',
  'website',
  'submissions',
  'blogs',
  'newsletter',
  'analytics',
  'team',
  'attendance',
  'notepad',
  'projects',
];

function hashPassword(password: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${password}`).digest('hex');
}

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const email = process.env.SUPERADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.SUPERADMIN_PASSWORD;
  const resetAll = process.env.RESET_ALL === 'true' || process.env.RESET_ALL === '1';

  if (!url || !key) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
  }
  if (!email || !password) {
    console.error('Set SUPERADMIN_EMAIL and SUPERADMIN_PASSWORD env vars');
    process.exit(1);
  }

  const salt = randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const now = new Date().toISOString();
  const name = process.env.SUPERADMIN_NAME?.trim() || 'Super Admin';

  const row = {
    id: 'user-super-admin',
    name,
    email,
    role: 'super_admin',
    features: FEATURES,
    active: true,
    department: 'Leadership',
    phone: '',
    avatar: null,
    created_at: now,
    updated_at: now,
    created_by: null,
    password_hash: passwordHash,
    salt,
  };

  const sb = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  if (resetAll) {
    const { error: deleteError } = await sb.from('admin_users').delete().neq('id', '');
    if (deleteError) {
      console.error('Failed to delete users:', deleteError.message);
      process.exit(1);
    }
    console.log('Removed all admin users from database.');
  }

  const { error } = await sb.from('admin_users').upsert(row, { onConflict: 'id' });
  if (error) {
    console.error('Failed:', error.message);
    process.exit(1);
  }

  // Keep local JSON fallback in sync when developers switch STORAGE_MODE=json
  const localUser = {
    id: 'user-super-admin',
    name,
    email,
    role: 'super_admin',
    features: FEATURES,
    active: true,
    department: 'Leadership',
    phone: '',
    createdAt: now,
    updatedAt: now,
    salt,
    passwordHash,
  };
  writeFileSync(resolve(process.cwd(), 'data/users.json'), JSON.stringify([localUser], null, 2));

  console.log('Super admin ready:', email);
}

main();
