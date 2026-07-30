/**
 * Read server env at runtime using dynamic keys.
 * Next.js can inline process.env.FOO at build time (empty if unset during build).
 * Bracket access keeps Vercel runtime env vars available after deploy.
 */
export function readServerEnv(name: string): string {
  const raw = process.env[name];
  if (typeof raw !== 'string') return '';
  return raw.trim().replace(/^["']|["']$/g, '');
}

export function hasServerEnv(name: string): boolean {
  return Boolean(readServerEnv(name));
}
