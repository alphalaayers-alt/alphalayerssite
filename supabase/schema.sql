-- Alpha Layers — full system schema for Supabase
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run

create extension if not exists "pgcrypto";

-- ========== ADMIN USERS ==========
create table if not exists admin_users (
  id text primary key,
  name text not null,
  email text unique not null,
  role text not null,
  features jsonb not null default '[]'::jsonb,
  active boolean not null default true,
  department text default '',
  phone text default '',
  avatar text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by text,
  password_hash text not null,
  salt text not null
);

-- ========== FORM SUBMISSIONS ==========
create table if not exists submissions (
  id text primary key,
  type text not null check (type in ('contact', 'quote', 'newsletter')),
  data jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists submissions_type_idx on submissions (type);
create index if not exists submissions_created_at_idx on submissions (created_at desc);

-- ========== BLOGS ==========
create table if not exists blogs (
  id text primary key,
  title text not null,
  category text not null default 'Insights',
  read_time text not null default '3 min read',
  date text not null,
  excerpt text not null default '',
  content text not null,
  image text not null default '',
  published boolean not null default true,
  author jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========== NEWSLETTER ==========
create table if not exists newsletter_subscribers (
  id text primary key,
  email text unique not null,
  name text,
  active boolean not null default true,
  source text,
  created_at timestamptz not null default now()
);

create table if not exists newsletter_campaigns (
  id text primary key,
  subject text not null,
  body text not null,
  status text not null check (status in ('draft', 'sent', 'failed')),
  recipient_count int not null default 0,
  recipients jsonb default '[]'::jsonb,
  mode text,
  created_at timestamptz not null default now(),
  sent_at timestamptz,
  error text
);

-- ========== SITE CONTENT (single document) ==========
create table if not exists site_content (
  id text primary key default 'main',
  content jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into site_content (id, content)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

-- ========== ATTENDANCE ==========
create table if not exists attendance (
  id text primary key,
  user_id text not null,
  date date not null,
  status text not null check (status in ('present', 'absent', 'leave', 'half_day', 'remote')),
  note text default '',
  marked_by text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, date)
);

create index if not exists attendance_user_date_idx on attendance (user_id, date);

-- ========== NOTES ==========
create table if not exists notes (
  id text primary key,
  user_id text not null,
  title text not null default 'Untitled',
  body text not null default '',
  pinned boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists notes_user_idx on notes (user_id, updated_at desc);

-- ========== PROJECTS ==========
create table if not exists projects (
  id text primary key,
  title text not null,
  description text not null default '',
  status text not null default 'planned',
  priority text not null default 'medium',
  owner_id text not null,
  member_ids jsonb not null default '[]'::jsonb,
  tasks jsonb not null default '[]'::jsonb,
  start_date date,
  due_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ========== GA SETTINGS (optional; OAuth tokens) ==========
create table if not exists ga_settings (
  id text primary key default 'main',
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into ga_settings (id, settings)
values ('main', '{}'::jsonb)
on conflict (id) do nothing;

-- Service role bypasses RLS. Keep tables locked for anon/authenticated.
alter table admin_users enable row level security;
alter table submissions enable row level security;
alter table blogs enable row level security;
alter table newsletter_subscribers enable row level security;
alter table newsletter_campaigns enable row level security;
alter table site_content enable row level security;
alter table attendance enable row level security;
alter table notes enable row level security;
alter table projects enable row level security;
alter table ga_settings enable row level security;

-- Public read for published blogs + site content (optional anon policies)
create policy "Public can read published blogs"
  on blogs for select
  to anon, authenticated
  using (published = true);

create policy "Public can read site content"
  on site_content for select
  to anon, authenticated
  using (true);

create policy "Public can insert newsletter signup submissions"
  on submissions for insert
  to anon, authenticated
  with check (type in ('contact', 'quote', 'newsletter'));
