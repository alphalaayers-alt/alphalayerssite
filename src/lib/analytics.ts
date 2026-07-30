import { getGaSettings } from './ga-settings';

export type AnalyticsRange = '7daysAgo' | '28daysAgo' | '90daysAgo';

export interface AnalyticsSummary {
  configured: boolean;
  connected: boolean;
  message?: string;
  propertyId?: string;
  range?: string;
  users?: number;
  newUsers?: number;
  sessions?: number;
  pageViews?: number;
  bounceRate?: number;
  avgSessionDuration?: number;
  engagementRate?: number;
  eventCount?: number;
  daily?: { date: string; users: number; sessions: number; pageViews: number }[];
  topPages?: { path: string; views: number; users: number }[];
  sources?: { source: string; sessions: number; users: number }[];
  devices?: { device: string; sessions: number; users: number }[];
  countries?: { country: string; users: number; sessions: number }[];
}

type GaRow = {
  dimensionValues?: { value: string }[];
  metricValues?: { value: string }[];
};

function base64Url(input: Buffer | string) {
  const buf = Buffer.isBuffer(input) ? input : Buffer.from(input);
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function getAccessTokenFromServiceAccount(): Promise<string> {
  const clientEmail = process.env.GA_CLIENT_EMAIL;
  const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n');
  if (!clientEmail || !privateKey) throw new Error('Service account credentials missing');

  const now = Math.floor(Date.now() / 1000);
  const header = base64Url(JSON.stringify({ alg: 'RS256', typ: 'JWT' }));
  const claim = base64Url(
    JSON.stringify({
      iss: clientEmail,
      scope: 'https://www.googleapis.com/auth/analytics.readonly',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now,
    })
  );

  const { createSign } = await import('crypto');
  const signer = createSign('RSA-SHA256');
  signer.update(`${header}.${claim}`);
  signer.end();
  const signature = base64Url(signer.sign(privateKey));
  const jwt = `${header}.${claim}.${signature}`;

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  });
  if (!tokenRes.ok) throw new Error('Failed to authenticate with service account');
  const tokenData = await tokenRes.json();
  return tokenData.access_token as string;
}

async function getAccessTokenFromOAuth(): Promise<string> {
  const settings = await getGaSettings();
  const refreshToken = settings.refreshToken || process.env.GA_REFRESH_TOKEN;
  const clientId = process.env.GA_OAUTH_CLIENT_ID;
  const clientSecret = process.env.GA_OAUTH_CLIENT_SECRET;
  if (!refreshToken || !clientId || !clientSecret) throw new Error('Google OAuth is not connected');

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!tokenRes.ok) {
    const err = await tokenRes.text();
    throw new Error(`OAuth token refresh failed: ${err}`);
  }
  const tokenData = await tokenRes.json();
  return tokenData.access_token as string;
}

async function getGoogleAccessToken(): Promise<string> {
  const settings = await getGaSettings();
  if (settings.refreshToken || process.env.GA_REFRESH_TOKEN) {
    return getAccessTokenFromOAuth();
  }
  if (process.env.GA_CLIENT_EMAIL && process.env.GA_PRIVATE_KEY) {
    return getAccessTokenFromServiceAccount();
  }
  throw new Error('No Google Analytics credentials configured');
}

async function runReport(
  accessToken: string,
  propertyId: string,
  body: Record<string, unknown>
): Promise<{ rows?: GaRow[] }> {
  const res = await fetch(
    `https://analyticsdata.googleapis.com/v1beta/properties/${propertyId}:runReport`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }
  );
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err);
  }
  return res.json();
}

function rangeLabel(startDate: AnalyticsRange): string {
  if (startDate === '7daysAgo') return 'Last 7 days';
  if (startDate === '90daysAgo') return 'Last 90 days';
  return 'Last 28 days';
}

function formatDateLabel(yyyymmdd: string): string {
  if (!yyyymmdd || yyyymmdd.length !== 8) return yyyymmdd;
  const y = yyyymmdd.slice(0, 4);
  const m = yyyymmdd.slice(4, 6);
  const d = yyyymmdd.slice(6, 8);
  return `${d}/${m}`;
}

export async function getAnalyticsSummary(
  startDate: AnalyticsRange = '28daysAgo'
): Promise<AnalyticsSummary> {
  const settings = await getGaSettings();
  const propertyId = settings.propertyId || process.env.GA_PROPERTY_ID;
  const connected = Boolean(settings.refreshToken || process.env.GA_REFRESH_TOKEN);
  const hasOAuthClient = Boolean(process.env.GA_OAUTH_CLIENT_ID && process.env.GA_OAUTH_CLIENT_SECRET);
  const hasServiceAccount = Boolean(process.env.GA_CLIENT_EMAIL && process.env.GA_PRIVATE_KEY);

  if (!propertyId) {
    return {
      configured: false,
      connected,
      message: 'Add your GA4 Property ID, then connect with Google.',
      propertyId,
    };
  }

  if (!connected && !process.env.GA_REFRESH_TOKEN && !hasServiceAccount) {
    return {
      configured: hasOAuthClient,
      connected: false,
      propertyId,
      message: hasOAuthClient
        ? 'Click Connect with Google to authorize analytics access.'
        : 'Set GA_OAUTH_CLIENT_ID and GA_OAUTH_CLIENT_SECRET, then connect with Google.',
    };
  }

  try {
    const accessToken = await getGoogleAccessToken();
    const dateRanges = [{ startDate, endDate: 'today' }];

    const [overview, daily, pages, sources, devices, countries] = await Promise.all([
      runReport(accessToken, propertyId, {
        dateRanges,
        metrics: [
          { name: 'activeUsers' },
          { name: 'newUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
          { name: 'bounceRate' },
          { name: 'averageSessionDuration' },
          { name: 'engagementRate' },
          { name: 'eventCount' },
        ],
      }),
      runReport(accessToken, propertyId, {
        dateRanges,
        dimensions: [{ name: 'date' }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'sessions' },
          { name: 'screenPageViews' },
        ],
        orderBys: [{ dimension: { dimensionName: 'date' } }],
      }),
      runReport(accessToken, propertyId, {
        dateRanges,
        dimensions: [{ name: 'pagePath' }],
        metrics: [{ name: 'screenPageViews' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'screenPageViews' }, desc: true }],
        limit: 10,
      }),
      runReport(accessToken, propertyId, {
        dateRanges,
        dimensions: [{ name: 'sessionDefaultChannelGroup' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
        limit: 8,
      }),
      runReport(accessToken, propertyId, {
        dateRanges,
        dimensions: [{ name: 'deviceCategory' }],
        metrics: [{ name: 'sessions' }, { name: 'activeUsers' }],
        orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
      }),
      runReport(accessToken, propertyId, {
        dateRanges,
        dimensions: [{ name: 'country' }],
        metrics: [{ name: 'activeUsers' }, { name: 'sessions' }],
        orderBys: [{ metric: { metricName: 'activeUsers' }, desc: true }],
        limit: 8,
      }),
    ]);

    const values = overview.rows?.[0]?.metricValues || [];

    return {
      configured: true,
      connected: true,
      propertyId,
      range: rangeLabel(startDate),
      users: Number(values[0]?.value || 0),
      newUsers: Number(values[1]?.value || 0),
      sessions: Number(values[2]?.value || 0),
      pageViews: Number(values[3]?.value || 0),
      bounceRate: Number(values[4]?.value || 0),
      avgSessionDuration: Number(values[5]?.value || 0),
      engagementRate: Number(values[6]?.value || 0),
      eventCount: Number(values[7]?.value || 0),
      daily: (daily.rows || []).map((row) => ({
        date: formatDateLabel(row.dimensionValues?.[0]?.value || ''),
        users: Number(row.metricValues?.[0]?.value || 0),
        sessions: Number(row.metricValues?.[1]?.value || 0),
        pageViews: Number(row.metricValues?.[2]?.value || 0),
      })),
      topPages: (pages.rows || []).map((row) => ({
        path: row.dimensionValues?.[0]?.value || '/',
        views: Number(row.metricValues?.[0]?.value || 0),
        users: Number(row.metricValues?.[1]?.value || 0),
      })),
      sources: (sources.rows || []).map((row) => ({
        source: row.dimensionValues?.[0]?.value || 'Unknown',
        sessions: Number(row.metricValues?.[0]?.value || 0),
        users: Number(row.metricValues?.[1]?.value || 0),
      })),
      devices: (devices.rows || []).map((row) => ({
        device: row.dimensionValues?.[0]?.value || 'Unknown',
        sessions: Number(row.metricValues?.[0]?.value || 0),
        users: Number(row.metricValues?.[1]?.value || 0),
      })),
      countries: (countries.rows || []).map((row) => ({
        country: row.dimensionValues?.[0]?.value || 'Unknown',
        users: Number(row.metricValues?.[0]?.value || 0),
        sessions: Number(row.metricValues?.[1]?.value || 0),
      })),
    };
  } catch (error) {
    return {
      configured: true,
      connected,
      propertyId,
      message: error instanceof Error ? error.message : 'Failed to load analytics',
    };
  }
}
