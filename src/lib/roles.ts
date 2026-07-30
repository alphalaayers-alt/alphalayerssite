export const FEATURES = [
  'overview',
  'website',
  'submissions',
  'blogs',
  'newsletter',
  'analytics',
  'team',
  'attendance',
  'notepad',
  'projects',
] as const;

export type Feature = (typeof FEATURES)[number];

export const ROLES = [
  'super_admin',
  'manager',
  'hr',
  'content_writer',
  'social_media_manager',
  'seo',
  'frontend_developer',
  'backend_developer',
  'fullstack_developer',
  'employee',
] as const;

export type Role = (typeof ROLES)[number];

export const FEATURE_LABELS: Record<Feature, string> = {
  overview: 'Overview',
  website: 'Website Manager',
  submissions: 'Submissions',
  blogs: 'Blogs',
  newsletter: 'Newsletter',
  analytics: 'Analytics',
  team: 'Team & Users',
  attendance: 'Attendance',
  notepad: 'Notepad',
  projects: 'Projects',
};

export const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  manager: 'Manager',
  hr: 'HR',
  content_writer: 'Content Writer',
  social_media_manager: 'Social Media Manager',
  seo: 'SEO Persona',
  frontend_developer: 'Frontend Developer',
  backend_developer: 'Backend Developer',
  fullstack_developer: 'Full Stack Developer',
  employee: 'Employee',
};

/** Default feature access by role — can be overridden per user. */
export const ROLE_DEFAULT_FEATURES: Record<Role, Feature[]> = {
  super_admin: [...FEATURES],
  manager: [
    'overview',
    'website',
    'submissions',
    'blogs',
    'newsletter',
    'analytics',
    'team',
    'attendance',
    'notepad',
    'projects',
  ],
  hr: ['overview', 'team', 'attendance', 'notepad', 'projects'],
  content_writer: ['overview', 'website', 'blogs', 'newsletter', 'notepad', 'projects'],
  social_media_manager: ['overview', 'blogs', 'newsletter', 'analytics', 'notepad', 'projects'],
  seo: ['overview', 'analytics', 'website', 'blogs', 'notepad'],
  frontend_developer: ['overview', 'website', 'projects', 'notepad'],
  backend_developer: ['overview', 'projects', 'notepad', 'analytics'],
  fullstack_developer: ['overview', 'website', 'projects', 'notepad', 'analytics', 'blogs'],
  employee: ['overview', 'attendance', 'notepad', 'projects'],
};

export function getDefaultFeatures(role: Role): Feature[] {
  return [...(ROLE_DEFAULT_FEATURES[role] || ROLE_DEFAULT_FEATURES.employee)];
}

export function canManageUsers(role: Role): boolean {
  return role === 'super_admin' || role === 'manager' || role === 'hr';
}

export function canCreateRole(actorRole: Role, targetRole: Role): boolean {
  if (actorRole === 'super_admin') return true;
  if (actorRole === 'manager') return targetRole !== 'super_admin';
  if (actorRole === 'hr') {
    return !['super_admin', 'manager'].includes(targetRole);
  }
  return false;
}
