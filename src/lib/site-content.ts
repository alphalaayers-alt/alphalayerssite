import { readJsonFile, writeJsonFile } from './storage';
import { DEFAULT_SITE_CONTENT } from './site-content-defaults';
import type { SiteContent } from '@/types/site-content';
import { getSupabase, isSupabaseEnabled } from './supabase/client';

const FILE = 'site-content.json';

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function mergeSiteContent(partial: Partial<SiteContent> | null | undefined): SiteContent {
  const base = structuredClone(DEFAULT_SITE_CONTENT);
  if (!partial) return base;

  const merge = (target: Record<string, unknown>, source: Record<string, unknown>) => {
    for (const [key, value] of Object.entries(source)) {
      if (Array.isArray(value)) {
        target[key] = value;
      } else if (isObject(value) && isObject(target[key])) {
        merge(target[key] as Record<string, unknown>, value);
      } else if (value !== undefined) {
        target[key] = value;
      }
    }
  };

  merge(base as unknown as Record<string, unknown>, partial as unknown as Record<string, unknown>);
  return base;
}

export async function getSiteContent(): Promise<SiteContent> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { data, error } = await sb.from('site_content').select('content').eq('id', 'main').maybeSingle();
    if (error) throw new Error(error.message);
    return mergeSiteContent((data?.content as Partial<SiteContent>) || null);
  }
  const stored = await readJsonFile<Partial<SiteContent> | null>(FILE, null);
  return mergeSiteContent(stored);
}

export async function saveSiteContent(content: SiteContent): Promise<SiteContent> {
  const next = mergeSiteContent({
    ...content,
    updatedAt: new Date().toISOString(),
  });

  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error } = await sb.from('site_content').upsert({
      id: 'main',
      content: next,
      updated_at: next.updatedAt,
    });
    if (error) throw new Error(error.message);
    return next;
  }

  await writeJsonFile(FILE, next);
  return next;
}

export async function resetSiteContent(): Promise<SiteContent> {
  const next = {
    ...structuredClone(DEFAULT_SITE_CONTENT),
    updatedAt: new Date().toISOString(),
  };

  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error } = await sb.from('site_content').upsert({
      id: 'main',
      content: next,
      updated_at: next.updatedAt,
    });
    if (error) throw new Error(error.message);
    return next;
  }

  await writeJsonFile(FILE, next);
  return next;
}
