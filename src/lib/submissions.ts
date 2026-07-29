import { promises as fs } from 'fs';
import path from 'path';

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
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  const parsed = JSON.parse(raw);
  return Array.isArray(parsed) ? parsed : [];
}

export async function addSubmission(
  type: SubmissionType,
  data: Record<string, string>
): Promise<Submission> {
  const submissions = await getSubmissions();
  const submission: Submission = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
    type,
    createdAt: new Date().toISOString(),
    data,
  };
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
