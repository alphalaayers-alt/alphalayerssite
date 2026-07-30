import { NextResponse } from 'next/server';
import { getGaSettings, getOAuthRedirectUri, saveGaSettings } from '@/lib/ga-settings';

function getAdminRedirectBase(request: Request): string {
  const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL;
  if (appUrl) return appUrl.replace(/\/$/, '');

  const origin = new URL(request.url).origin;
  // Browser cannot open 0.0.0.0 — map to localhost
  return origin.replace('://0.0.0.0', '://localhost').replace('://127.0.0.1', '://localhost');
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  const adminUrl = new URL('/admin', `${getAdminRedirectBase(request)}/`);

  if (error) {
    adminUrl.searchParams.set('ga_error', error);
    return NextResponse.redirect(adminUrl);
  }

  if (!code) {
    adminUrl.searchParams.set('ga_error', 'missing_code');
    return NextResponse.redirect(adminUrl);
  }

  const clientId = process.env.GA_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GA_OAUTH_CLIENT_SECRET;
  const redirectUri = getOAuthRedirectUri();

  if (!clientId || !clientSecret) {
    adminUrl.searchParams.set('ga_error', 'oauth_not_configured');
    return NextResponse.redirect(adminUrl);
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    adminUrl.searchParams.set('ga_error', 'token_exchange_failed');
    return NextResponse.redirect(adminUrl);
  }

  const tokenData = await tokenRes.json();
  const refreshToken = tokenData.refresh_token as string | undefined;

  if (!refreshToken) {
    adminUrl.searchParams.set('ga_error', 'no_refresh_token');
    return NextResponse.redirect(adminUrl);
  }

  const existing = await getGaSettings();
  await saveGaSettings({
    ...existing,
    refreshToken,
    connectedAt: new Date().toISOString(),
  });

  adminUrl.searchParams.set('ga_connected', '1');
  return NextResponse.redirect(adminUrl);
}
