'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  BarChart3,
  CalendarDays,
  Eye,
  FileText,
  FolderKanban,
  Globe,
  LayoutDashboard,
  LogOut,
  Mail,
  Menu,
  MessageSquare,
  Newspaper,
  NotebookPen,
  Plus,
  RefreshCw,
  Send,
  Shield,
  Trash2,
  Users,
  X,
} from 'lucide-react';
import {
  BentoButton,
  BentoCard,
  BentoGrid,
  BentoInput,
  BentoStat,
  BentoTextarea,
  BentoTitle,
} from '@/components/admin/BentoUI';
import { WebsiteManager } from '@/components/admin/WebsiteManager';
import { TeamManager } from '@/components/admin/TeamManager';
import { AttendancePanel } from '@/components/admin/AttendancePanel';
import { NotepadPanel } from '@/components/admin/NotepadPanel';
import { ProjectsPanel } from '@/components/admin/ProjectsPanel';
import { ROLE_LABELS, type Feature, type Role } from '@/lib/roles';

type Tab =
  | 'overview'
  | 'website'
  | 'submissions'
  | 'blogs'
  | 'newsletter'
  | 'analytics'
  | 'team'
  | 'attendance'
  | 'notepad'
  | 'projects';

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  features: Feature[];
}

interface Submission {
  id: string;
  type: 'contact' | 'quote' | 'newsletter';
  createdAt: string;
  data: Record<string, string>;
}

interface Stats {
  total: number;
  byType: { contact: number; quote: number; newsletter: number };
  today: number;
  thisWeek: number;
}

interface BlogItem {
  id: string;
  title: string;
  category: string;
  readTime: string;
  date: string;
  excerpt: string;
  content: string;
  image: string;
  published: boolean;
  author: { name: string; role: string; avatar: string };
}

interface Subscriber {
  id: string;
  email: string;
  name?: string;
  active: boolean;
  createdAt: string;
  source?: string;
}

interface Campaign {
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

interface NewsletterStatus {
  mode: 'demo' | 'live';
  storage: string;
  supabaseReady: boolean;
  resendReady: boolean;
}

interface AnalyticsData {
  configured: boolean;
  connected?: boolean;
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

interface GaSettingsData {
  propertyId: string;
  connected: boolean;
  connectedAt?: string;
  hasOAuthClient: boolean;
  measurementId: string;
}

const NAV_ITEMS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }>; feature: Feature }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard, feature: 'overview' },
  { id: 'website', label: 'Website', icon: Globe, feature: 'website' },
  { id: 'submissions', label: 'Submissions', icon: MessageSquare, feature: 'submissions' },
  { id: 'blogs', label: 'Blogs', icon: Newspaper, feature: 'blogs' },
  { id: 'newsletter', label: 'Newsletter', icon: Mail, feature: 'newsletter' },
  { id: 'analytics', label: 'Analytics', icon: BarChart3, feature: 'analytics' },
  { id: 'team', label: 'Team', icon: Users, feature: 'team' },
  { id: 'attendance', label: 'Attendance', icon: CalendarDays, feature: 'attendance' },
  { id: 'notepad', label: 'Notepad', icon: NotebookPen, feature: 'notepad' },
  { id: 'projects', label: 'Projects', icon: FolderKanban, feature: 'projects' },
];

function hasFeature(user: SessionUser | null, feature: Feature) {
  if (!user) return false;
  if (user.role === 'super_admin') return true;
  return user.features.includes(feature);
}

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [sessionUser, setSessionUser] = useState<SessionUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [tab, setTab] = useState<Tab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [newsletterStatus, setNewsletterStatus] = useState<NewsletterStatus | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [gaSettings, setGaSettings] = useState<GaSettingsData | null>(null);
  const [propertyIdInput, setPropertyIdInput] = useState('');
  const [gaMessage, setGaMessage] = useState('');
  const [analyticsRange, setAnalyticsRange] = useState<'7daysAgo' | '28daysAgo' | '90daysAgo'>('28daysAgo');
  const [filter, setFilter] = useState<'all' | 'contact' | 'quote' | 'newsletter'>('all');

  const [blogForm, setBlogForm] = useState({
    title: '',
    category: 'Insights',
    excerpt: '',
    content: '',
    image: '/src/assets/images/blog_ai_finance_1785300931668.jpg',
    authorName: 'Alpha Layers Team',
    authorRole: 'Editor',
    published: true,
  });
  const [blogSaving, setBlogSaving] = useState(false);
  const [blogMessage, setBlogMessage] = useState('');

  const [campaignForm, setCampaignForm] = useState({ subject: '', content: '' });
  const [subscriberForm, setSubscriberForm] = useState({ email: '', name: '' });
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [newsletterBusy, setNewsletterBusy] = useState(false);
  const [newsletterMessage, setNewsletterMessage] = useState('');
  const [showPreview, setShowPreview] = useState(false);

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/session', { credentials: 'include' });
      const data = await res.json();
      setAuthenticated(Boolean(data.authenticated));
      setSessionUser(data.user || null);
    } catch {
      setAuthenticated(false);
      setSessionUser(null);
    } finally {
      setCheckingSession(false);
    }
  }, []);

  const visibleNav = useMemo(
    () => NAV_ITEMS.filter((item) => hasFeature(sessionUser, item.feature)),
    [sessionUser]
  );

  useEffect(() => {
    if (!sessionUser) return;
    if (!hasFeature(sessionUser, tab as Feature)) {
      const first = NAV_ITEMS.find((item) => hasFeature(sessionUser, item.feature));
      if (first) setTab(first.id);
    }
  }, [sessionUser, tab]);

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      const requests: Promise<Response>[] = [];
      const keys: string[] = [];

      if (hasFeature(sessionUser, 'overview') || hasFeature(sessionUser, 'submissions')) {
        requests.push(fetch('/api/admin/stats'));
        keys.push('stats');
        requests.push(fetch('/api/admin/submissions'));
        keys.push('subs');
      }
      if (hasFeature(sessionUser, 'blogs')) {
        requests.push(fetch('/api/admin/blogs'));
        keys.push('blogs');
      }
      if (hasFeature(sessionUser, 'newsletter')) {
        requests.push(fetch('/api/admin/newsletter'));
        keys.push('news');
      }
      if (hasFeature(sessionUser, 'analytics')) {
        requests.push(fetch(`/api/admin/analytics?range=${analyticsRange}`));
        keys.push('analytics');
        requests.push(fetch('/api/admin/analytics/settings'));
        keys.push('ga');
      }

      if (requests.length === 0) return;

      const responses = await Promise.all(requests);
      if (responses.some((r) => r.status === 401)) {
        setAuthenticated(false);
        setSessionUser(null);
        return;
      }

      const payloads = await Promise.all(responses.map((r) => r.json()));
      const map = Object.fromEntries(keys.map((k, i) => [k, payloads[i]]));

      if (map.stats) setStats(map.stats);
      if (map.subs) setSubmissions(map.subs.submissions || []);
      if (map.blogs) setBlogs(map.blogs.blogs || []);
      if (map.news) {
        setSubscribers(map.news.subscribers || []);
        setCampaigns(map.news.campaigns || []);
        setNewsletterStatus(map.news.status || null);
      }
      if (map.analytics) setAnalytics(map.analytics);
      if (map.ga) {
        setGaSettings(map.ga);
        setPropertyIdInput(map.ga.propertyId || '');
      }
    } finally {
      setLoading(false);
    }
  }, [analyticsRange, sessionUser]);

  const loadAnalyticsOnly = useCallback(async (range: '7daysAgo' | '28daysAgo' | '90daysAgo') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/analytics?range=${range}`);
      if (res.status === 401) {
        setAuthenticated(false);
        return;
      }
      const data = await res.json();
      setAnalytics(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (authenticated) loadAll();
  }, [authenticated, loadAll]);

  useEffect(() => {
    if (!authenticated) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get('ga_connected') === '1') {
      setGaMessage('Google Analytics connected successfully!');
      setTab('analytics');
      window.history.replaceState({}, '', '/admin');
      loadAll();
    }
    const gaError = params.get('ga_error');
    if (gaError) {
      setGaMessage(`Connection failed: ${gaError}`);
      setTab('analytics');
      window.history.replaceState({}, '', '/admin');
    }
  }, [authenticated, loadAll]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: trimmedEmail, password: trimmedPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setLoginError(data.error || 'Invalid credentials');
        return;
      }
      setAuthenticated(true);
      setSessionUser(data.user || null);
      setPassword('');
      setEmail(trimmedEmail);
    } catch {
      setLoginError('Login failed');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
    setSessionUser(null);
  };

  const filteredSubmissions = useMemo(
    () => (filter === 'all' ? submissions : submissions.filter((s) => s.type === filter)),
    [filter, submissions]
  );

  const savePropertyId = async () => {
    setGaMessage('');
    const res = await fetch('/api/admin/analytics/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ propertyId: propertyIdInput }),
    });
    const data = await res.json();
    if (!res.ok) {
      setGaMessage(data.error || 'Failed to save Property ID');
      return;
    }
    setGaMessage('Property ID saved. Now click Connect with Google.');
    await loadAll();
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });

  const publishBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setBlogSaving(true);
    setBlogMessage('');
    try {
      const res = await fetch('/api/admin/blogs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(blogForm),
      });
      const data = await res.json();
      if (!res.ok) {
        setBlogMessage(data.error || 'Failed to publish');
        return;
      }
      setBlogMessage('Blog published successfully');
      setBlogForm({
        title: '',
        category: 'Insights',
        excerpt: '',
        content: '',
        image: '/src/assets/images/blog_ai_finance_1785300931668.jpg',
        authorName: 'Alpha Layers Team',
        authorRole: 'Editor',
        published: true,
      });
      await loadAll();
    } finally {
      setBlogSaving(false);
    }
  };

  const toggleBlogPublished = async (blog: BlogItem) => {
    await fetch('/api/admin/blogs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: blog.id, published: !blog.published }),
    });
    await loadAll();
  };

  const removeBlog = async (id: string) => {
    if (!confirm('Delete this blog post?')) return;
    await fetch(`/api/admin/blogs?id=${id}`, { method: 'DELETE' });
    await loadAll();
  };

  const createAndSendCampaign = async (sendNow: boolean) => {
    setNewsletterBusy(true);
    setNewsletterMessage('');
    try {
      if (sendNow) {
        const sendRes = await fetch('/api/admin/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_and_send',
            subject: campaignForm.subject,
            content: campaignForm.content,
          }),
        });
        const sendData = await sendRes.json();
        if (!sendRes.ok) {
          setNewsletterMessage(sendData.error || 'Failed to send');
        } else {
          setNewsletterMessage(
            sendData.campaign?.mode === 'demo'
              ? `DEMO: Sent to ${sendData.campaign?.recipientCount || 0} local subscribers (saved in dashboard).`
              : `Sent to ${sendData.campaign?.recipientCount || 0} subscribers.`
          );
          setCampaignForm({ subject: '', content: '' });
          setShowPreview(false);
        }
      } else {
        const createRes = await fetch('/api/admin/newsletter', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_campaign',
            subject: campaignForm.subject,
            content: campaignForm.content,
          }),
        });
        const createData = await createRes.json();
        if (!createRes.ok) {
          setNewsletterMessage(createData.error || 'Failed to create campaign');
        } else {
          setNewsletterMessage('Draft saved');
          setCampaignForm({ subject: '', content: '' });
          setShowPreview(false);
        }
      }
      await loadAll();
    } finally {
      setNewsletterBusy(false);
    }
  };

  const addSubscriberFromAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterBusy(true);
    setNewsletterMessage('');
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'add_subscriber',
          email: subscriberForm.email,
          name: subscriberForm.name,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNewsletterMessage(data.error || 'Failed to add subscriber');
        return;
      }
      setSubscriberForm({ email: '', name: '' });
      setNewsletterMessage(`Added ${data.subscriber.email}`);
      await loadAll();
    } finally {
      setNewsletterBusy(false);
    }
  };

  const sendExistingCampaign = async (id: string) => {
    setNewsletterBusy(true);
    setNewsletterMessage('');
    try {
      const res = await fetch('/api/admin/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send_campaign', id }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNewsletterMessage(data.error || 'Failed to send');
      } else {
        setNewsletterMessage(`Campaign sent to ${data.campaign?.recipientCount || 0} subscribers`);
      }
      await loadAll();
    } finally {
      setNewsletterBusy(false);
    }
  };

  const removeCampaign = async (id: string) => {
    if (!confirm('Delete this campaign?')) return;
    await fetch('/api/admin/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_campaign', id }),
    });
    if (selectedCampaign?.id === id) setSelectedCampaign(null);
    await loadAll();
  };

  const toggleSubscriber = async (sub: Subscriber) => {
    await fetch('/api/admin/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'toggle_subscriber', id: sub.id, active: !sub.active }),
    });
    await loadAll();
  };

  const removeSubscriber = async (id: string) => {
    if (!confirm('Remove this subscriber?')) return;
    await fetch('/api/admin/newsletter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'delete_subscriber', id }),
    });
    await loadAll();
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070b10]">
        <div className="rounded-[2rem] border border-white/10 bg-[#121a22] p-8">
          <RefreshCw className="w-8 h-8 text-[#3b82f6] animate-spin" />
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-[#070b10]">
        <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#15202b] to-[#0f1620] p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Staff Login</h1>
              <p className="text-xs text-slate-400 mt-0.5">Alpha Layers · Role-based Dashboard</p>
            </div>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Email
              </label>
              <BentoInput
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="souravmandal909p@gmail.com"
                autoComplete="email"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Password
              </label>
              <BentoInput
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                autoComplete="current-password"
              />
            </div>
            {loginError && <p className="text-xs text-red-400">{loginError}</p>}
            <BentoButton type="submit" disabled={loggingIn} className="w-full py-3.5 rounded-2xl">
              {loggingIn ? 'Signing in...' : 'Sign In'}
            </BentoButton>
            <p className="text-[11px] text-slate-500 text-center">
              Sign in with your staff email and password from the Team database.
            </p>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070b10] text-slate-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(37,99,235,0.12),_transparent_50%)]" />

      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#070b10]/80 border-b border-white/8">
        <div className="h-16 px-4 sm:px-6 flex items-center justify-between max-w-[1600px] mx-auto">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen((v) => !v)}
              className="lg:hidden p-2.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm leading-none">Alpha Layers</p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {sessionUser ? ROLE_LABELS[sessionUser.role] : 'Dashboard'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BentoButton variant="ghost" onClick={loadAll} className="hidden sm:inline-flex !py-2 !px-3 !rounded-2xl text-xs">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </BentoButton>
            <BentoButton variant="danger" onClick={handleLogout} className="!py-2 !px-3 !rounded-2xl text-xs">
              <LogOut className="w-3.5 h-3.5" />
              Logout
            </BentoButton>
          </div>
        </div>
      </header>

      <div className="relative max-w-[1600px] mx-auto flex">
        <aside
          className={`fixed lg:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-[5.75rem] p-3 transition-transform lg:translate-x-0 ${
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="h-full rounded-[1.75rem] border border-white/8 bg-[#101820]/90 backdrop-blur-xl p-2 flex flex-col">
            <nav className="space-y-1.5 flex-1 overflow-y-auto">
              {visibleNav.map((item) => {
                const Icon = item.icon;
                const active = tab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    title={item.label}
                    aria-label={item.label}
                    onClick={() => {
                      setTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-center p-3 rounded-2xl transition-all ${
                      active
                        ? 'bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-lg shadow-blue-500/20'
                        : 'text-slate-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </button>
                );
              })}
            </nav>
            <div className="mt-3 rounded-2xl bg-white/5 border border-white/8 p-2 text-center">
              <p className="text-[10px] text-slate-400 truncate" title={sessionUser?.name || 'User'}>
                {sessionUser?.name?.split(' ')[0] || 'User'}
              </p>
              <p className="text-[9px] text-slate-500 truncate mt-0.5">
                {sessionUser ? ROLE_LABELS[sessionUser.role] : ''}
              </p>
            </div>
          </div>
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-20 bg-black/60 lg:hidden top-16" onClick={() => setSidebarOpen(false)} />
        )}

        <main className="flex-1 p-4 sm:p-6 lg:p-8 w-full min-w-0">
          {tab === 'overview' && hasFeature(sessionUser, 'overview') && (
            <section className="space-y-5">
              <BentoTitle
                title={`Welcome, ${sessionUser?.name || 'Team'}`}
                subtitle={`${sessionUser ? ROLE_LABELS[sessionUser.role] : 'Staff'} workspace overview`}
              />
              {(hasFeature(sessionUser, 'submissions') || sessionUser?.role === 'super_admin') && (
                <BentoGrid>
                  <BentoStat icon={Users} label="Total Submissions" value={stats?.total || 0} accent="blue" />
                  <BentoStat icon={MessageSquare} label="Contact Forms" value={stats?.byType.contact || 0} accent="green" />
                  <BentoStat icon={FileText} label="Quotes" value={stats?.byType.quote || 0} accent="purple" />
                  <BentoStat icon={Mail} label="Newsletter Signups" value={stats?.byType.newsletter || 0} accent="amber" />
                </BentoGrid>
              )}
              <BentoGrid className="!xl:grid-cols-3">
                {hasFeature(sessionUser, 'attendance') && (
                  <BentoCard className="cursor-pointer hover:border-[#2563eb]/40" onClick={() => setTab('attendance')}>
                    <CalendarDays className="w-5 h-5 text-[#60a5fa] mb-3" />
                    <p className="font-bold">Attendance</p>
                    <p className="text-xs text-slate-400 mt-1">Open your calendar and mark days</p>
                  </BentoCard>
                )}
                {hasFeature(sessionUser, 'notepad') && (
                  <BentoCard className="cursor-pointer hover:border-[#2563eb]/40" onClick={() => setTab('notepad')}>
                    <NotebookPen className="w-5 h-5 text-emerald-300 mb-3" />
                    <p className="font-bold">Notepad</p>
                    <p className="text-xs text-slate-400 mt-1">Personal notes and pinned ideas</p>
                  </BentoCard>
                )}
                {hasFeature(sessionUser, 'projects') && (
                  <BentoCard className="cursor-pointer hover:border-[#2563eb]/40" onClick={() => setTab('projects')}>
                    <FolderKanban className="w-5 h-5 text-violet-300 mb-3" />
                    <p className="font-bold">Projects</p>
                    <p className="text-xs text-slate-400 mt-1">Track tasks and project status</p>
                  </BentoCard>
                )}
                {hasFeature(sessionUser, 'team') && (
                  <BentoCard className="cursor-pointer hover:border-[#2563eb]/40" onClick={() => setTab('team')}>
                    <Users className="w-5 h-5 text-amber-300 mb-3" />
                    <p className="font-bold">Team</p>
                    <p className="text-xs text-slate-400 mt-1">Create users and manage role access</p>
                  </BentoCard>
                )}
              </BentoGrid>
            </section>
          )}

          {tab === 'website' && hasFeature(sessionUser, 'website') && <WebsiteManager />}

          {tab === 'team' && hasFeature(sessionUser, 'team') && sessionUser && (
            <TeamManager currentRole={sessionUser.role} />
          )}

          {tab === 'attendance' && hasFeature(sessionUser, 'attendance') && sessionUser && (
            <AttendancePanel currentUserId={sessionUser.id} currentRole={sessionUser.role} />
          )}

          {tab === 'notepad' && hasFeature(sessionUser, 'notepad') && <NotepadPanel />}

          {tab === 'projects' && hasFeature(sessionUser, 'projects') && sessionUser && (
            <ProjectsPanel currentUserId={sessionUser.id} />
          )}

          {tab === 'submissions' && hasFeature(sessionUser, 'submissions') && (
            <section className="space-y-5">
              <BentoTitle
                title="Submissions"
                subtitle="All contact, quote, and newsletter form data"
                action={
                  <div className="flex flex-wrap gap-2">
                    {(['all', 'contact', 'quote', 'newsletter'] as const).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-semibold transition-all ${
                          filter === f
                            ? 'bg-[#2563eb] text-white shadow-lg shadow-blue-500/20'
                            : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {f === 'all' ? 'All' : f}
                      </button>
                    ))}
                  </div>
                }
              />

              <BentoGrid className="!grid-cols-2 xl:!grid-cols-4 mb-5">
                <BentoStat icon={Users} label="Showing" value={filteredSubmissions.length} />
                <BentoStat icon={MessageSquare} label="Contact" value={stats?.byType.contact || 0} accent="green" />
                <BentoStat icon={FileText} label="Quotes" value={stats?.byType.quote || 0} accent="purple" />
                <BentoStat icon={Mail} label="Newsletter" value={stats?.byType.newsletter || 0} accent="amber" />
              </BentoGrid>

              <BentoCard className="!p-0 overflow-hidden xl:col-span-4">
                {filteredSubmissions.length === 0 ? (
                  <p className="p-10 text-center text-slate-400 text-sm">No submissions yet.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-white/8">
                          <th className="px-5 py-4 font-semibold">Date</th>
                          <th className="px-5 py-4 font-semibold">Type</th>
                          <th className="px-5 py-4 font-semibold">Name</th>
                          <th className="px-5 py-4 font-semibold">Email</th>
                          <th className="px-5 py-4 font-semibold">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredSubmissions.map((sub) => (
                          <tr key={sub.id} className="border-b border-white/5 hover:bg-white/[0.03]">
                            <td className="px-5 py-4 whitespace-nowrap text-slate-300">{formatDate(sub.createdAt)}</td>
                            <td className="px-5 py-4">
                              <span className="bg-[#2563eb]/15 text-[#93c5fd] text-[11px] font-bold px-2.5 py-1 rounded-xl">
                                {sub.type}
                              </span>
                            </td>
                            <td className="px-5 py-4 font-medium">{sub.data.name || sub.data.fullName || '—'}</td>
                            <td className="px-5 py-4 text-slate-300">{sub.data.email || '—'}</td>
                            <td className="px-5 py-4 text-slate-400 max-w-xs truncate">
                              {sub.data.subject || sub.data.service || sub.data.message || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </BentoCard>
            </section>
          )}

          {tab === 'blogs' && hasFeature(sessionUser, 'blogs') && (
            <section className="space-y-5">
              <BentoTitle title="Blog Manager" subtitle="Publish and manage posts from the dashboard" />

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                <BentoCard className="xl:col-span-3 space-y-4">
                  <h3 className="font-bold flex items-center gap-2 text-lg">
                    <span className="w-9 h-9 rounded-2xl bg-[#2563eb]/20 text-[#60a5fa] flex items-center justify-center">
                      <Plus className="w-4 h-4" />
                    </span>
                    New Blog Post
                  </h3>
                  <form onSubmit={publishBlog} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <BentoInput
                        required
                        placeholder="Title"
                        value={blogForm.title}
                        onChange={(e) => setBlogForm({ ...blogForm, title: e.target.value })}
                      />
                      <BentoInput
                        placeholder="Category"
                        value={blogForm.category}
                        onChange={(e) => setBlogForm({ ...blogForm, category: e.target.value })}
                      />
                    </div>
                    <BentoInput
                      placeholder="Image URL"
                      value={blogForm.image}
                      onChange={(e) => setBlogForm({ ...blogForm, image: e.target.value })}
                    />
                    <BentoInput
                      placeholder="Short excerpt"
                      value={blogForm.excerpt}
                      onChange={(e) => setBlogForm({ ...blogForm, excerpt: e.target.value })}
                    />
                    <BentoTextarea
                      required
                      rows={7}
                      placeholder="Full blog content..."
                      value={blogForm.content}
                      onChange={(e) => setBlogForm({ ...blogForm, content: e.target.value })}
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <BentoInput
                        placeholder="Author name"
                        value={blogForm.authorName}
                        onChange={(e) => setBlogForm({ ...blogForm, authorName: e.target.value })}
                      />
                      <BentoInput
                        placeholder="Author role"
                        value={blogForm.authorRole}
                        onChange={(e) => setBlogForm({ ...blogForm, authorRole: e.target.value })}
                      />
                    </div>
                    <label className="flex items-center gap-2 text-sm text-slate-300">
                      <input
                        type="checkbox"
                        checked={blogForm.published}
                        onChange={(e) => setBlogForm({ ...blogForm, published: e.target.checked })}
                      />
                      Publish immediately
                    </label>
                    {blogMessage && <p className="text-xs text-[#93c5fd]">{blogMessage}</p>}
                    <BentoButton type="submit" disabled={blogSaving}>
                      {blogSaving ? 'Saving...' : 'Publish Blog'}
                    </BentoButton>
                  </form>
                </BentoCard>

                <BentoCard className="xl:col-span-2 space-y-3">
                  <h3 className="font-bold text-lg">Published & Drafts</h3>
                  <div className="space-y-3 max-h-[34rem] overflow-y-auto pr-1">
                    {blogs.length === 0 ? (
                      <p className="text-sm text-slate-400 py-8 text-center">No blogs yet.</p>
                    ) : (
                      blogs.map((blog) => (
                        <div
                          key={blog.id}
                          className="rounded-2xl border border-white/8 bg-[#0d151c]/60 p-4 space-y-3"
                        >
                          <div>
                            <p className="font-semibold leading-snug">{blog.title}</p>
                            <p className="text-[11px] text-slate-400 mt-1">
                              {blog.category} · {blog.date} · {blog.published ? 'Published' : 'Draft'}
                            </p>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            <BentoButton variant="ghost" className="!py-1.5 !px-3 !text-xs" onClick={() => toggleBlogPublished(blog)}>
                              <Eye className="w-3.5 h-3.5" />
                              {blog.published ? 'Unpublish' : 'Publish'}
                            </BentoButton>
                            <BentoButton variant="danger" className="!py-1.5 !px-3 !text-xs" onClick={() => removeBlog(blog.id)}>
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete
                            </BentoButton>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </BentoCard>
              </div>
            </section>
          )}

          {tab === 'newsletter' && hasFeature(sessionUser, 'newsletter') && (
            <section className="space-y-5">
              <BentoTitle
                title="Newsletter Center"
                subtitle="Write, preview, and send news to subscribers"
                action={
                  <span
                    className={`text-xs font-semibold px-3 py-1.5 rounded-2xl border ${
                      newsletterStatus?.mode === 'demo'
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                        : 'bg-green-500/10 border-green-500/30 text-green-400'
                    }`}
                  >
                    {newsletterStatus?.mode === 'demo' ? 'DEMO MODE' : 'LIVE MODE'}
                  </span>
                }
              />

              <BentoGrid>
                <BentoStat icon={Users} label="Active Subscribers" value={subscribers.filter((s) => s.active).length} />
                <BentoStat icon={Mail} label="Total Subscribers" value={subscribers.length} accent="amber" />
                <BentoStat icon={FileText} label="Drafts" value={campaigns.filter((c) => c.status === 'draft').length} accent="purple" />
                <BentoStat icon={Send} label="Sent Campaigns" value={campaigns.filter((c) => c.status === 'sent').length} accent="green" />
              </BentoGrid>

              {newsletterStatus?.mode === 'demo' && (
                <BentoCard className="!bg-amber-500/10 !border-amber-500/30 !from-amber-500/10 !to-amber-500/5">
                  <p className="text-xs text-amber-100">
                    Demo mode is ON for testing. Sends are saved in the dashboard (no real email). Later we will connect
                    Supabase for storage and Resend for real delivery.
                  </p>
                </BentoCard>
              )}

              <div className="grid grid-cols-1 xl:grid-cols-5 gap-4">
                <BentoCard className="xl:col-span-3 space-y-4">
                  <h3 className="font-bold flex items-center gap-2 text-lg">
                    <span className="w-9 h-9 rounded-2xl bg-[#2563eb]/20 text-[#60a5fa] flex items-center justify-center">
                      <Send className="w-4 h-4" />
                    </span>
                    Compose Newsletter
                  </h3>
                  <BentoInput
                    placeholder="Subject (e.g. Alpha Layers Weekly Update)"
                    value={campaignForm.subject}
                    onChange={(e) => setCampaignForm({ ...campaignForm, subject: e.target.value })}
                  />
                  <BentoTextarea
                    rows={10}
                    placeholder="Write your newsletter content here..."
                    value={campaignForm.content}
                    onChange={(e) => setCampaignForm({ ...campaignForm, content: e.target.value })}
                  />
                  {newsletterMessage && <p className="text-xs text-[#93c5fd]">{newsletterMessage}</p>}
                  <div className="flex flex-wrap gap-2">
                    <BentoButton
                      variant="ghost"
                      disabled={newsletterBusy || !campaignForm.subject || !campaignForm.content}
                      onClick={() => setShowPreview((v) => !v)}
                    >
                      {showPreview ? 'Hide Preview' : 'Preview'}
                    </BentoButton>
                    <BentoButton
                      variant="soft"
                      disabled={newsletterBusy || !campaignForm.subject || !campaignForm.content}
                      onClick={() => createAndSendCampaign(false)}
                    >
                      Save Draft
                    </BentoButton>
                    <BentoButton
                      disabled={newsletterBusy || !campaignForm.subject || !campaignForm.content}
                      onClick={() => createAndSendCampaign(true)}
                    >
                      {newsletterBusy ? 'Sending...' : 'Send to All Active'}
                    </BentoButton>
                  </div>
                </BentoCard>

                <BentoCard className="xl:col-span-2 space-y-4">
                  <h3 className="font-bold text-lg">Email Preview</h3>
                  {showPreview && campaignForm.subject && campaignForm.content ? (
                    <div className="rounded-2xl overflow-hidden border border-white/10 bg-white text-slate-800">
                      <div className="bg-[#2563eb] text-white px-4 py-3">
                        <p className="text-sm font-bold">Alpha Layers</p>
                        <p className="text-[11px] opacity-90">IT Services Agency Newsletter</p>
                      </div>
                      <div className="p-4 space-y-3">
                        <h4 className="text-base font-bold">{campaignForm.subject}</h4>
                        {campaignForm.content.split(/\n{2,}/).map((p, i) => (
                          <p key={i} className="text-sm leading-relaxed whitespace-pre-wrap">
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-400 py-16 text-center">
                      Write subject + content, then click Preview.
                    </p>
                  )}
                </BentoCard>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <BentoCard className="space-y-4">
                  <h3 className="font-bold text-lg">Subscribers</h3>
                  <form onSubmit={addSubscriberFromAdmin} className="flex flex-col sm:flex-row gap-2">
                    <BentoInput
                      required
                      type="email"
                      placeholder="email@example.com"
                      value={subscriberForm.email}
                      onChange={(e) => setSubscriberForm({ ...subscriberForm, email: e.target.value })}
                    />
                    <BentoInput
                      placeholder="Name (optional)"
                      value={subscriberForm.name}
                      onChange={(e) => setSubscriberForm({ ...subscriberForm, name: e.target.value })}
                      className="sm:w-36"
                    />
                    <BentoButton type="submit" disabled={newsletterBusy} className="shrink-0">
                      Add
                    </BentoButton>
                  </form>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {subscribers.length === 0 ? (
                      <p className="text-sm text-slate-400">No subscribers yet.</p>
                    ) : (
                      subscribers.map((sub) => (
                        <div key={sub.id} className="flex items-center justify-between gap-2 py-2.5 border-b border-white/5">
                          <div>
                            <p className="text-sm">{sub.email}</p>
                            <p className="text-[11px] text-slate-500">
                              {sub.name ? `${sub.name} · ` : ''}
                              {sub.active ? 'Active' : 'Inactive'}
                              {sub.source ? ` · ${sub.source}` : ''} · {formatDate(sub.createdAt)}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            <BentoButton variant="ghost" className="!py-1 !px-2 !text-[11px]" onClick={() => toggleSubscriber(sub)}>
                              {sub.active ? 'Disable' : 'Enable'}
                            </BentoButton>
                            <BentoButton variant="danger" className="!py-1 !px-2 !text-[11px]" onClick={() => removeSubscriber(sub.id)}>
                              Delete
                            </BentoButton>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </BentoCard>

                <BentoCard className="space-y-3">
                  <h3 className="font-bold text-lg">Campaign History</h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {campaigns.length === 0 ? (
                      <p className="text-sm text-slate-400">No campaigns yet.</p>
                    ) : (
                      campaigns.map((c) => (
                        <div key={c.id} className="rounded-2xl border border-white/8 bg-[#0d151c]/50 p-3 space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <p className="text-sm font-medium">{c.subject}</p>
                              <p className="text-[11px] text-slate-500">
                                {c.status.toUpperCase()}
                                {c.mode ? ` · ${c.mode}` : ''} · {c.recipientCount} recipients · {formatDate(c.createdAt)}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <BentoButton variant="ghost" className="!py-1 !px-2 !text-[11px]" onClick={() => setSelectedCampaign(selectedCampaign?.id === c.id ? null : c)}>
                                {selectedCampaign?.id === c.id ? 'Hide' : 'View'}
                              </BentoButton>
                              {c.status === 'draft' && (
                                <BentoButton className="!py-1 !px-2 !text-[11px]" onClick={() => sendExistingCampaign(c.id)}>
                                  Send
                                </BentoButton>
                              )}
                              <BentoButton variant="danger" className="!py-1 !px-2 !text-[11px]" onClick={() => removeCampaign(c.id)}>
                                Delete
                              </BentoButton>
                            </div>
                          </div>
                          {selectedCampaign?.id === c.id && (
                            <div className="bg-[#070b10] rounded-xl p-3 text-xs text-slate-300 space-y-2">
                              <p className="whitespace-pre-wrap">{c.body}</p>
                              {c.recipients && c.recipients.length > 0 && (
                                <p className="text-slate-500">Recipients: {c.recipients.join(', ')}</p>
                              )}
                              {c.error && <p className="text-amber-400">{c.error}</p>}
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </BentoCard>
              </div>
            </section>
          )}


          {tab === 'analytics' && hasFeature(sessionUser, 'analytics') && (
            <section className="space-y-5">
              <BentoTitle
                title="Analytics Dashboard"
                subtitle="Live Google Analytics traffic for your website"
                action={
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-xs font-semibold px-3 py-1.5 rounded-2xl border ${
                        gaSettings?.connected
                          ? 'bg-green-500/10 border-green-500/30 text-green-400'
                          : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      }`}
                    >
                      {gaSettings?.connected ? '● Connected' : '○ Not connected'}
                    </span>
                    {(['7daysAgo', '28daysAgo', '90daysAgo'] as const).map((r) => (
                      <BentoButton
                        key={r}
                        variant={analyticsRange === r ? 'primary' : 'ghost'}
                        className="!py-1.5 !px-3 !text-xs"
                        onClick={() => {
                          setAnalyticsRange(r);
                          loadAnalyticsOnly(r);
                        }}
                      >
                        {r === '7daysAgo' ? '7D' : r === '28daysAgo' ? '28D' : '90D'}
                      </BentoButton>
                    ))}
                    <BentoButton
                      variant="ghost"
                      className="!py-1.5 !px-3 !text-xs"
                      onClick={() => loadAnalyticsOnly(analyticsRange)}
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                      Refresh
                    </BentoButton>
                  </div>
                }
              />

              {!gaSettings?.connected ? (
                <BentoCard className="space-y-4">
                  <h3 className="font-bold text-lg">Connect Google Analytics</h3>
                  <p className="text-sm text-slate-400">Connect Google Analytics to view traffic here.</p>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <BentoInput
                      placeholder="GA4 Property ID"
                      value={propertyIdInput}
                      onChange={(e) => setPropertyIdInput(e.target.value)}
                      className="flex-1"
                    />
                    <BentoButton variant="ghost" onClick={savePropertyId}>
                      Save Property ID
                    </BentoButton>
                    <a
                      href="/api/admin/analytics/connect"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold text-center"
                    >
                      Connect with Google
                    </a>
                  </div>
                  {gaMessage && <p className="text-xs text-[#93c5fd]">{gaMessage}</p>}
                </BentoCard>
              ) : analytics?.message && analytics.users === undefined ? (
                <BentoCard className="!bg-amber-500/10 !border-amber-500/30 !from-amber-500/10 !to-amber-500/5">
                  <p className="text-sm text-amber-100">{analytics.message}</p>
                </BentoCard>
              ) : (
                <>
                  <BentoGrid>
                    <BentoStat icon={Users} label="Users" value={analytics?.users || 0} />
                    <BentoStat icon={Users} label="New Users" value={analytics?.newUsers || 0} accent="green" />
                    <BentoStat icon={BarChart3} label="Sessions" value={analytics?.sessions || 0} accent="purple" />
                    <BentoStat icon={Eye} label="Page Views" value={analytics?.pageViews || 0} accent="amber" />
                  </BentoGrid>

                  <BentoGrid>
                    <BentoStat
                      icon={FileText}
                      label="Bounce Rate %"
                      value={Number(((analytics?.bounceRate || 0) * 100).toFixed(1))}
                      accent="amber"
                    />
                    <BentoStat
                      icon={BarChart3}
                      label="Engagement %"
                      value={Number(((analytics?.engagementRate || 0) * 100).toFixed(1))}
                      accent="green"
                    />
                    <BentoStat
                      icon={Eye}
                      label="Avg Session (s)"
                      value={Math.round(analytics?.avgSessionDuration || 0)}
                    />
                    <BentoStat
                      icon={MessageSquare}
                      label="Events"
                      value={analytics?.eventCount || 0}
                      accent="purple"
                    />
                  </BentoGrid>

                  <BentoCard className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">Traffic Trend</h3>
                      <span className="text-xs text-slate-400 px-3 py-1 rounded-2xl bg-white/5 border border-white/10">
                        {analytics?.range}
                      </span>
                    </div>
                    <LineChart
                      data={(analytics?.daily || []).map((d) => ({
                        label: d.date,
                        a: d.users,
                        b: d.sessions,
                        c: d.pageViews,
                      }))}
                      legends={[
                        { key: 'a', label: 'Users', color: '#3b82f6' },
                        { key: 'b', label: 'Sessions', color: '#22c55e' },
                        { key: 'c', label: 'Page Views', color: '#a78bfa' },
                      ]}
                    />
                  </BentoCard>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <BentoCard>
                      <h3 className="font-bold text-lg mb-4">Top Pages</h3>
                      <BarList
                        items={(analytics?.topPages || []).map((p) => ({
                          label: p.path,
                          value: p.views,
                          sub: `${p.users} users`,
                        }))}
                      />
                    </BentoCard>
                    <BentoCard>
                      <h3 className="font-bold text-lg mb-4">Traffic Sources</h3>
                      <BarList
                        items={(analytics?.sources || []).map((s) => ({
                          label: s.source,
                          value: s.sessions,
                          sub: `${s.users} users`,
                        }))}
                        color="#22c55e"
                      />
                    </BentoCard>
                    <BentoCard>
                      <h3 className="font-bold text-lg mb-4">Devices</h3>
                      <BarList
                        items={(analytics?.devices || []).map((d) => ({
                          label: d.device,
                          value: d.sessions,
                          sub: `${d.users} users`,
                        }))}
                        color="#f59e0b"
                      />
                    </BentoCard>
                    <BentoCard>
                      <h3 className="font-bold text-lg mb-4">Top Countries</h3>
                      <BarList
                        items={(analytics?.countries || []).map((c) => ({
                          label: c.country,
                          value: c.users,
                          sub: `${c.sessions} sessions`,
                        }))}
                        color="#a78bfa"
                      />
                    </BentoCard>
                  </div>

                  <BentoCard className="space-y-3">
                    <h3 className="font-bold text-lg">Quick Actions</h3>
                    <div className="flex flex-wrap gap-2">
                      <BentoButton onClick={() => loadAnalyticsOnly(analyticsRange)} className="!text-xs">
                        Refresh Analytics Data
                      </BentoButton>
                      <a
                        href="https://analytics.google.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200"
                      >
                        Open Google Analytics
                      </a>
                      <a
                        href="/"
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-xs bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200"
                      >
                        Open Website
                      </a>
                    </div>
                  </BentoCard>
                </>
              )}
            </section>
          )}


        </main>
      </div>
    </div>
  );
}

function BarList({
  items,
  color = '#3b82f6',
}: {
  items: { label: string; value: number; sub?: string }[];
  color?: string;
}) {
  if (!items.length) {
    return <p className="text-sm text-slate-400">No data yet.</p>;
  }
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div key={item.label}>
          <div className="flex items-center justify-between gap-2 text-xs mb-1">
            <span className="text-slate-300 truncate">{item.label}</span>
            <span className="text-slate-200 font-semibold whitespace-nowrap">
              {item.value}
              {item.sub ? <span className="text-slate-500 font-normal"> · {item.sub}</span> : null}
            </span>
          </div>
          <div className="h-2 rounded-full bg-white/5 overflow-hidden">
            <div
              className="h-full rounded-full"
              style={{ width: `${(item.value / max) * 100}%`, backgroundColor: color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function LineChart({
  data,
  legends,
}: {
  data: { label: string; a: number; b: number; c: number }[];
  legends: { key: 'a' | 'b' | 'c'; label: string; color: string }[];
}) {
  if (!data.length) {
    return <p className="text-sm text-slate-400 py-10 text-center">No trend data yet. Traffic will appear after site visits.</p>;
  }

  const width = 720;
  const height = 220;
  const padX = 28;
  const padY = 20;
  const max = Math.max(...data.flatMap((d) => [d.a, d.b, d.c]), 1);

  const point = (index: number, value: number) => {
    const x = padX + (index / Math.max(data.length - 1, 1)) * (width - padX * 2);
    const y = height - padY - (value / max) * (height - padY * 2);
    return `${x},${y}`;
  };

  const pathFor = (key: 'a' | 'b' | 'c') =>
    data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${point(i, d[key])}`).join(' ');

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-3 text-xs">
        {legends.map((l) => (
          <span key={l.key} className="flex items-center gap-2 text-slate-300">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: l.color }} />
            {l.label}
          </span>
        ))}
      </div>
      <div className="w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full min-w-[520px] h-[220px]">
          {[0, 0.25, 0.5, 0.75, 1].map((t) => {
            const y = height - padY - t * (height - padY * 2);
            return (
              <line
                key={t}
                x1={padX}
                x2={width - padX}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.06)"
              />
            );
          })}
          {legends.map((l) => (
            <path
              key={l.key}
              d={pathFor(l.key)}
              fill="none"
              stroke={l.color}
              strokeWidth="2.5"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          ))}
          {data.map((d, i) => (
            <text
              key={d.label + i}
              x={padX + (i / Math.max(data.length - 1, 1)) * (width - padX * 2)}
              y={height - 4}
              textAnchor="middle"
              fill="#64748b"
              fontSize="10"
            >
              {data.length > 14 && i % 2 !== 0 ? '' : d.label}
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
