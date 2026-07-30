import { promises as fs } from 'fs';
import path from 'path';
import { getSupabase, isSupabaseEnabled } from './supabase/client';

export type SubmissionType = 'contact' | 'quote' | 'newsletter';

export interface Submission {
  id: string;
  type: SubmissionType;
  createdAt: string;
  data: Record<string, string>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'submissions.json');

async function ensureDataFile() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf-8');
  }
}

export async function getSubmissions(): Promise<Submission[]> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { data, error } = await sb.from('submissions').select('*').order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map((row) => ({
      id: row.id,
      type: row.type as SubmissionType,
      createdAt: row.created_at,
      data: (row.data || {}) as Record<string, string>,
    }));
  }

  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export async function addSubmission(
  type: SubmissionType,
  data: Record<string, string>
): Promise<Submission> {
  const submission: Submission = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    createdAt: new Date().toISOString(),
    data,
  };

  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error } = await sb.from('submissions').insert({
      id: submission.id,
      type: submission.type,
      data: submission.data,
      created_at: submission.createdAt,
    });
    if (error) throw new Error(error.message);
    return submission;
  }

  const submissions = await getSubmissions();
  submissions.unshift(submission);
  await fs.writeFile(DATA_FILE, JSON.stringify(submissions, null, 2), 'utf-8');
  return submission;
}

export async function getSubmissionStats() {
  const submissions = await getSubmissions();
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  startOfWeek.setDate(startOfWeek.getDate() - 7);

  const byType = { contact: 0, quote: 0, newsletter: 0 };
  let today = 0;
  let thisWeek = 0;

  for (const s of submissions) {
    if (byType[s.type] !== undefined) byType[s.type]++;
    const created = new Date(s.createdAt);
    if (created >= startOfToday) today++;
    if (created >= startOfWeek) thisWeek++;
  }

  return {
    total: submissions.length,
    byType,
    today,
    thisWeek,
    recent: submissions.slice(0, 10),
  };
}
