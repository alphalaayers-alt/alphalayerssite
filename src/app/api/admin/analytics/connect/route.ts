import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getOAuthRedirectUri } from '@/lib/ga-settings';

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const clientId = process.env.GA_OAUTH_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json(
      { error: 'GA_OAUTH_CLIENT_ID is not set in environment variables' },
      { status: 400 }
    );
  }

  // Prefer request origin so local/live URLs match Google Cloud settings
  const origin = new URL(request.url).origin;
  const redirectUri = process.env.APP_URL
    ? getOAuthRedirectUri()
    : `${origin}/api/admin/analytics/callback`;

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    access_type: 'offline',
    prompt: 'consent',
  });

  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
}
