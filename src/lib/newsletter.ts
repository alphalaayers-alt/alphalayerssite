import { createId, readJsonFile, writeJsonFile } from './storage';
import { getSupabase, isSupabaseEnabled } from './supabase/client';

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  active: boolean;
  createdAt: string;
  source?: 'website' | 'admin' | 'demo';
}

export interface NewsletterCampaign {
  id: string;
  subject: string;
  body: string;
  status: 'draft' | 'sent' | 'failed';
  recipientCount: number;
  recipients?: string[];
  createdAt: string;
  sentAt?: string;
  error?: string;
  mode?: 'demo' | 'live';
}

const SUBSCRIBERS_FILE = 'newsletter-subscribers.json';
const CAMPAIGNS_FILE = 'newsletter-campaigns.json';

export function isDemoMode(): boolean {
  const mode = process.env.NEWSLETTER_MODE || 'demo';
  if (mode === 'live' && process.env.RESEND_API_KEY) return false;
  return mode !== 'live';
}

const DEMO_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: 'sub-demo-1',
    email: 'demo.user@example.com',
    name: 'Demo User',
    active: true,
    createdAt: new Date().toISOString(),
    source: 'demo',
  },
];

function subFromRow(row: Record<string, unknown>): NewsletterSubscriber {
  return {
    id: String(row.id),
    email: String(row.email),
    name: (row.name as string) || undefined,
    active: Boolean(row.active),
    createdAt: String(row.created_at || row.createdAt),
    source: row.source as NewsletterSubscriber['source'],
  };
}

function campFromRow(row: Record<string, unknown>): NewsletterCampaign {
  return {
    id: String(row.id),
    subject: String(row.subject),
    body: String(row.body),
    status: row.status as NewsletterCampaign['status'],
    recipientCount: Number(row.recipient_count || row.recipientCount || 0),
    recipients: (row.recipients as string[]) || [],
    createdAt: String(row.created_at || row.createdAt),
    sentAt: (row.sent_at as string) || undefined,
    error: (row.error as string) || undefined,
    mode: row.mode as NewsletterCampaign['mode'],
  };
}

export async function getSubscribers(): Promise<NewsletterSubscriber[]> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { data, error } = await sb
      .from('newsletter_subscribers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map((r) => subFromRow(r as Record<string, unknown>));
  }

  const list = await readJsonFile<NewsletterSubscriber[]>(SUBSCRIBERS_FILE, []);
  if (list.length === 0 && isDemoMode()) {
    await writeJsonFile(SUBSCRIBERS_FILE, DEMO_SUBSCRIBERS);
    return DEMO_SUBSCRIBERS;
  }
  return list;
}

export async function getActiveSubscribers(): Promise<NewsletterSubscriber[]> {
  return (await getSubscribers()).filter((s) => s.active);
}

export async function addSubscriber(
  email: string,
  options?: { name?: string; source?: NewsletterSubscriber['source'] }
): Promise<NewsletterSubscriber> {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !normalized.includes('@')) throw new Error('Valid email is required');

  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { data: existing } = await sb
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', normalized)
      .maybeSingle();
    if (existing) {
      if (!existing.active) {
        await sb.from('newsletter_subscribers').update({ active: true }).eq('id', existing.id);
        return { ...subFromRow(existing as Record<string, unknown>), active: true };
      }
      return subFromRow(existing as Record<string, unknown>);
    }
    const subscriber: NewsletterSubscriber = {
      id: createId('sub'),
      email: normalized,
      name: options?.name?.trim() || undefined,
      active: true,
      createdAt: new Date().toISOString(),
      source: options?.source || 'website',
    };
    const { error } = await sb.from('newsletter_subscribers').insert({
      id: subscriber.id,
      email: subscriber.email,
      name: subscriber.name || null,
      active: true,
      source: subscriber.source,
      created_at: subscriber.createdAt,
    });
    if (error) throw new Error(error.message);
    return subscriber;
  }

  const list = await getSubscribers();
  const existing = list.find((s) => s.email === normalized);
  if (existing) {
    if (!existing.active) {
      existing.active = true;
      await writeJsonFile(SUBSCRIBERS_FILE, list);
    }
    return existing;
  }

  const subscriber: NewsletterSubscriber = {
    id: createId('sub'),
    email: normalized,
    name: options?.name?.trim() || undefined,
    active: true,
    createdAt: new Date().toISOString(),
    source: options?.source || 'website',
  };
  list.unshift(subscriber);
  await writeJsonFile(SUBSCRIBERS_FILE, list);
  return subscriber;
}

export async function setSubscriberActive(id: string, active: boolean): Promise<boolean> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error, count } = await sb
      .from('newsletter_subscribers')
      .update({ active }, { count: 'exact' })
      .eq('id', id);
    if (error) throw new Error(error.message);
    return (count || 0) > 0;
  }
  const list = await getSubscribers();
  const item = list.find((s) => s.id === id);
  if (!item) return false;
  item.active = active;
  await writeJsonFile(SUBSCRIBERS_FILE, list);
  return true;
}

export async function deleteSubscriber(id: string): Promise<boolean> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error, count } = await sb
      .from('newsletter_subscribers')
      .delete({ count: 'exact' })
      .eq('id', id);
    if (error) throw new Error(error.message);
    return (count || 0) > 0;
  }
  const list = await getSubscribers();
  const next = list.filter((s) => s.id !== id);
  if (next.length === list.length) return false;
  await writeJsonFile(SUBSCRIBERS_FILE, next);
  return true;
}

export async function getCampaigns(): Promise<NewsletterCampaign[]> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { data, error } = await sb
      .from('newsletter_campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data || []).map((r) => campFromRow(r as Record<string, unknown>));
  }
  return readJsonFile<NewsletterCampaign[]>(CAMPAIGNS_FILE, []);
}

export async function createCampaign(
  subject: string,
  body: string,
  status: NewsletterCampaign['status'] = 'draft'
): Promise<NewsletterCampaign> {
  const campaign: NewsletterCampaign = {
    id: createId('camp'),
    subject: subject.trim(),
    body: body.trim(),
    status,
    recipientCount: 0,
    createdAt: new Date().toISOString(),
    mode: isDemoMode() ? 'demo' : 'live',
  };

  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error } = await sb.from('newsletter_campaigns').insert({
      id: campaign.id,
      subject: campaign.subject,
      body: campaign.body,
      status: campaign.status,
      recipient_count: 0,
      recipients: [],
      mode: campaign.mode,
      created_at: campaign.createdAt,
    });
    if (error) throw new Error(error.message);
    return campaign;
  }

  const campaigns = await getCampaigns();
  campaigns.unshift(campaign);
  await writeJsonFile(CAMPAIGNS_FILE, campaigns);
  return campaign;
}

export async function updateCampaign(
  id: string,
  updates: Partial<NewsletterCampaign>
): Promise<NewsletterCampaign | null> {
  if (isSupabaseEnabled()) {
    const campaigns = await getCampaigns();
    const current = campaigns.find((c) => c.id === id);
    if (!current) return null;
    const next = { ...current, ...updates, id: current.id };
    const sb = getSupabase();
    const { error } = await sb
      .from('newsletter_campaigns')
      .update({
        subject: next.subject,
        body: next.body,
        status: next.status,
        recipient_count: next.recipientCount,
        recipients: next.recipients || [],
        mode: next.mode,
        sent_at: next.sentAt || null,
        error: next.error || null,
      })
      .eq('id', id);
    if (error) throw new Error(error.message);
    return next;
  }

  const campaigns = await getCampaigns();
  const index = campaigns.findIndex((c) => c.id === id);
  if (index === -1) return null;
  campaigns[index] = { ...campaigns[index], ...updates, id: campaigns[index].id };
  await writeJsonFile(CAMPAIGNS_FILE, campaigns);
  return campaigns[index];
}

export async function deleteCampaign(id: string): Promise<boolean> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error, count } = await sb
      .from('newsletter_campaigns')
      .delete({ count: 'exact' })
      .eq('id', id);
    if (error) throw new Error(error.message);
    return (count || 0) > 0;
  }
  const campaigns = await getCampaigns();
  const next = campaigns.filter((c) => c.id !== id);
  if (next.length === campaigns.length) return false;
  await writeJsonFile(CAMPAIGNS_FILE, next);
  return true;
}

function toHtmlEmail(subject: string, body: string): string {
  const paragraphs = body
    .split(/\n{2,}/)
    .map((p) => `<p style="margin:0 0 14px;line-height:1.6;color:#334155;">${p.replace(/\n/g, '<br/>')}</p>`)
    .join('');

  return `<!DOCTYPE html><html><body style="margin:0;padding:0;background:#0d151c;font-family:Arial,sans-serif;">
  <div style="max-width:600px;margin:24px auto;background:#ffffff;border-radius:16px;overflow:hidden;">
    <div style="background:#2563eb;color:#fff;padding:20px 24px;"><h1 style="margin:0;font-size:20px;">Alpha Layers</h1></div>
    <div style="padding:24px;"><h2 style="margin:0 0 16px;font-size:18px;color:#0f172a;">${subject}</h2>${paragraphs}</div>
  </div></body></html>`;
}

async function sendViaResend(to: string[], subject: string, body: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.NEWSLETTER_FROM_EMAIL || 'Alpha Layers <onboarding@resend.dev>';
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured');
  const html = toHtmlEmail(subject, body);
  for (let i = 0; i < to.length; i += 50) {
    const batch = to.slice(i, i + 50);
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: batch, subject, html }),
    });
    if (!res.ok) throw new Error((await res.text()) || 'Failed to send newsletter');
  }
}

export async function sendCampaign(id: string): Promise<NewsletterCampaign> {
  const campaigns = await getCampaigns();
  const campaign = campaigns.find((c) => c.id === id);
  if (!campaign) throw new Error('Campaign not found');

  const subscribers = await getActiveSubscribers();
  const emails = subscribers.map((s) => s.email);
  if (emails.length === 0) throw new Error('No active subscribers');

  const demo = isDemoMode();
  try {
    if (!demo) await sendViaResend(emails, campaign.subject, campaign.body);
    const updated = await updateCampaign(id, {
      status: 'sent',
      recipientCount: emails.length,
      recipients: emails,
      sentAt: new Date().toISOString(),
      mode: demo ? 'demo' : 'live',
      error: demo
        ? 'DEMO MODE: saved as sent. Set NEWSLETTER_MODE=live + RESEND_API_KEY for real email.'
        : undefined,
    });
    if (!updated) throw new Error('Failed to update campaign');
    return updated;
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Send failed';
    await updateCampaign(id, {
      status: 'failed',
      recipientCount: emails.length,
      recipients: emails,
      error: message,
    });
    throw new Error(message);
  }
}

export function getNewsletterStatus() {
  return {
    mode: isDemoMode() ? 'demo' : 'live',
    storage: isSupabaseEnabled() ? 'supabase' : 'local-json',
    supabaseReady: Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY),
    resendReady: Boolean(process.env.RESEND_API_KEY),
  };
}
