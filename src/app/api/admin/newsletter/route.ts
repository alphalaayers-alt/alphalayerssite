import { NextResponse } from 'next/server';
import { isAdminAuthenticated } from '@/lib/admin-auth';
import {
  addSubscriber,
  createCampaign,
  deleteCampaign,
  deleteSubscriber,
  getCampaigns,
  getNewsletterStatus,
  getSubscribers,
  sendCampaign,
  setSubscriberActive,
} from '@/lib/newsletter';

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const [subscribers, campaigns] = await Promise.all([getSubscribers(), getCampaigns()]);
  return NextResponse.json({
    subscribers,
    campaigns,
    status: getNewsletterStatus(),
  });
}

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const action = body.action as string;

    if (action === 'add_subscriber') {
      const subscriber = await addSubscriber(String(body.email || ''), {
        name: body.name ? String(body.name) : undefined,
        source: 'admin',
      });
      return NextResponse.json({ subscriber });
    }

    if (action === 'create_campaign') {
      if (!body.subject || !body.content) {
        return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 });
      }
      const campaign = await createCampaign(String(body.subject), String(body.content), 'draft');
      return NextResponse.json({ campaign });
    }

    if (action === 'send_campaign') {
      if (!body.id) {
        return NextResponse.json({ error: 'Campaign id is required' }, { status: 400 });
      }
      const campaign = await sendCampaign(String(body.id));
      return NextResponse.json({ campaign });
    }

    if (action === 'create_and_send') {
      if (!body.subject || !body.content) {
        return NextResponse.json({ error: 'Subject and content are required' }, { status: 400 });
      }
      const draft = await createCampaign(String(body.subject), String(body.content), 'draft');
      const campaign = await sendCampaign(draft.id);
      return NextResponse.json({ campaign });
    }

    if (action === 'toggle_subscriber') {
      const ok = await setSubscriberActive(String(body.id), Boolean(body.active));
      if (!ok) return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    if (action === 'delete_subscriber') {
      const ok = await deleteSubscriber(String(body.id));
      if (!ok) return NextResponse.json({ error: 'Subscriber not found' }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    if (action === 'delete_campaign') {
      const ok = await deleteCampaign(String(body.id));
      if (!ok) return NextResponse.json({ error: 'Campaign not found' }, { status: 404 });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Newsletter action failed' },
      { status: 500 }
    );
  }
}
