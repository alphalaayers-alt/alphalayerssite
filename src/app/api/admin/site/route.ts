import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getSiteContent, resetSiteContent, saveSiteContent } from '@/lib/site-content';
import type { SiteContent } from '@/types/site-content';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const content = await getSiteContent();
  return NextResponse.json({ content });
}

export async function PUT(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    if (body?.action === 'reset') {
      const content = await resetSiteContent();
      return NextResponse.json({ content, message: 'Site content reset to defaults' });
    }

    if (!body?.content || typeof body.content !== 'object') {
      return NextResponse.json({ error: 'content object is required' }, { status: 400 });
    }

    const content = await saveSiteContent(body.content as SiteContent);
    return NextResponse.json({ content, message: 'Website content saved' });
  } catch {
    return NextResponse.json({ error: 'Failed to save site content' }, { status: 500 });
  }
}
