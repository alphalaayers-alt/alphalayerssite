import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import { getAnalyticsSummary, type AnalyticsRange } from '@/lib/analytics';

export async function GET(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const rangeParam = searchParams.get('range') || '28daysAgo';
  const range: AnalyticsRange =
    rangeParam === '7daysAgo' || rangeParam === '90daysAgo' ? rangeParam : '28daysAgo';

  const analytics = await getAnalyticsSummary(range);
  return NextResponse.json(analytics);
}
