/**
 * Supabase is now wired through src/lib/supabase/client.ts
 * and used by users/submissions/blogs/newsletter/site-content/
 * attendance/notes/projects/ga-settings when STORAGE_MODE=supabase.
 */
export { isSupabaseEnabled, getSupabase, supabaseStatus } from './supabase/client';
