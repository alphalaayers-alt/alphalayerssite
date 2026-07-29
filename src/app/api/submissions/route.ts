import { NextResponse } from 'next/server';
import { addSubmission, type SubmissionType } from '@/lib/submissions';

const VALID_TYPES: SubmissionType[] = ['contact', 'quote', 'newsletter'];

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const type = body.type as SubmissionType;

    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ error: 'Invalid submission type' }, { status: 400 });
    }

    const data = body.data;
    if (!data || typeof data !== 'object') {
      return NextResponse.json({ error: 'Invalid submission data' }, { status: 400 });
    }

    const sanitized: Record<string, string> = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        sanitized[key] = value.trim().slice(0, 2000);
      }
    }

    if (type === 'contact' && (!sanitized.name || !sanitized.email || !sanitized.message)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (type === 'quote' && (!sanitized.fullName || !sanitized.email)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (type === 'newsletter' && !sanitized.email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const submission = await addSubmission(type, sanitized);
    return NextResponse.json({ success: true, id: submission.id });
  } catch {
    return NextResponse.json({ error: 'Failed to save submission' }, { status: 500 });
  }
}
