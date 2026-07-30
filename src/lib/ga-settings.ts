import { readJsonFile, writeJsonFile } from './storage';
import { getSupabase, isSupabaseEnabled } from './supabase/client';

export interface GaSettings {
  refreshToken?: string;
  propertyId?: string;
  connectedAt?: string;
}

const FILE = 'ga-settings.json';

export async function getGaSettings(): Promise<GaSettings> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { data, error } = await sb.from('ga_settings').select('settings').eq('id', 'main').maybeSingle();
    if (error) throw new Error(error.message);
    return (data?.settings as GaSettings) || {};
  }
  return readJsonFile<GaSettings>(FILE, {});
}

export async function saveGaSettings(settings: GaSettings): Promise<void> {
  if (isSupabaseEnabled()) {
    const sb = getSupabase();
    const { error } = await sb.from('ga_settings').upsert({
      id: 'main',
      settings,
      updated_at: new Date().toISOString(),
    });
    if (error) throw new Error(error.message);
    return;
  }
  await writeJsonFile(FILE, settings);
}

export function getOAuthRedirectUri(): string {
  const base = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  return `${base.replace(/\/$/, '')}/api/admin/analytics/callback`;
}
