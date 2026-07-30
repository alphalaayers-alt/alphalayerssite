import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getGaSettings, saveGaSettings } from '@/lib/ga-settings';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const settings = await getGaSettings();
  const hasOAuthClient = Boolean(process.env.GA_OAUTH_CLIENT_ID && process.env.GA_OAUTH_CLIENT_SECRET);

  return NextResponse.json({
    propertyId: settings.propertyId || process.env.GA_PROPERTY_ID || '',
    connected: Boolean(settings.refreshToken || process.env.GA_REFRESH_TOKEN),
    connectedAt: settings.connectedAt,
    hasOAuthClient,
    measurementId: process.env.NEXT_PUBLIC_GA_ID || 'G-M4RGV60LEP',
  });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const propertyId = String(body.propertyId || '').trim();

    if (!propertyId || !/^\d+$/.test(propertyId)) {
      return NextResponse.json({ error: 'Property ID must be numbers only' }, { status: 400 });
    }

    const existing = await getGaSettings();
    await saveGaSettings({ ...existing, propertyId });

    return NextResponse.json({ success: true, propertyId });
  } catch {
    return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
  }
}
