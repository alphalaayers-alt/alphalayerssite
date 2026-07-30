import { NextResponse } from 'next/server';
import { getSiteContent } from '@/lib/site-content';

export async function GET() {
  try {
    const content = await getSiteContent();
    return NextResponse.json({ content });
  } catch {
    return NextResponse.json({ error: 'Failed to load site content' }, { status: 500 });
  }
}
