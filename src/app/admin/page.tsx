'use client';

import React, { useCallback, useEffect, useState } from 'react';
import {
  BarChart3,
  FileText,
  LogOut,
  Mail,
  MessageSquare,
  RefreshCw,
  Shield,
} from 'lucide-react';

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

export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'all' | 'contact' | 'quote' | 'newsletter'>('all');

  const checkSession = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/session');
      const data = await res.json();
      setAuthenticated(data.authenticated);
    } catch {
      setAuthenticated(false);
    } finally {
      setCheckingSession(false);
    }
  }, []);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [statsRes, subsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/submissions'),
      ]);

      if (statsRes.status === 401 || subsRes.status === 401) {
        setAuthenticated(false);
        return;
      }

      const statsData = await statsRes.json();
      const subsData = await subsRes.json();
      setStats(statsData);
      setSubmissions(subsData.submissions || []);
    } catch {
      setLoginError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (authenticated) {
      loadDashboard();
    }
  }, [authenticated, loadDashboard]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (!res.ok) {
        setLoginError('Invalid password');
        return;
      }

      setAuthenticated(true);
      setPassword('');
    } catch {
      setLoginError('Login failed. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    setAuthenticated(false);
    setSubmissions([]);
    setStats(null);
  };

  const filteredSubmissions =
    filter === 'all' ? submissions : submissions.filter((s) => s.type === filter);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('en-IN', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });

  const typeLabel = (type: Submission['type']) => {
    switch (type) {
      case 'contact':
        return 'Contact Form';
      case 'quote':
        return 'Quote Request';
      case 'newsletter':
        return 'Newsletter';
      default:
        return type;
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RefreshCw className="w-8 h-8 text-[#2563eb] animate-spin" />
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-[#131e28] border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-[#2563eb] flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Super Admin</h1>
              <p className="text-xs text-slate-400">Alpha Layers Dashboard</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Admin Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full bg-[#182531] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2563eb]"
              />
            </div>

            {loginError && <p className="text-xs text-red-400">{loginError}</p>}

            <button
              type="submit"
              disabled={loggingIn}
              className="w-full bg-[#2563eb] text-white font-bold py-3 rounded-full hover:bg-[#1d4ed8] transition-colors disabled:opacity-60"
            >
              {loggingIn ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 sm:px-8 lg:px-12 py-8">
      <div className="max-w-[1500px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Super Admin Dashboard</h1>
            <p className="text-sm text-slate-400 mt-1">View site stats and all user submissions</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={loadDashboard}
              disabled={loading}
              className="flex items-center gap-2 bg-[#18232c] border border-white/10 text-slate-200 px-4 py-2 rounded-full text-sm hover:bg-white/5 transition-colors"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-2 rounded-full text-sm hover:bg-red-500/20 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={BarChart3} label="Total Submissions" value={stats.total} />
            <StatCard icon={MessageSquare} label="Contact Forms" value={stats.byType.contact} />
            <StatCard icon={FileText} label="Quote Requests" value={stats.byType.quote} />
            <StatCard icon={Mail} label="Newsletter" value={stats.byType.newsletter} />
          </div>
        )}

        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-[#131e28] border border-white/10 rounded-2xl p-5">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Today</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.today}</p>
            </div>
            <div className="bg-[#131e28] border border-white/10 rounded-2xl p-5">
              <p className="text-xs text-slate-400 uppercase tracking-wider">Last 7 Days</p>
              <p className="text-3xl font-bold text-white mt-1">{stats.thisWeek}</p>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2">
          {(['all', 'contact', 'quote', 'newsletter'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                filter === tab
                  ? 'bg-[#2563eb] text-white'
                  : 'bg-[#18232c] text-slate-300 border border-white/10 hover:text-white'
              }`}
            >
              {tab === 'all' ? 'All' : typeLabel(tab)}
            </button>
          ))}
        </div>

        {/* Submissions Table */}
        <div className="bg-[#131e28] border border-white/10 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-white/10">
            <h2 className="text-lg font-bold text-white">
              Submissions ({filteredSubmissions.length})
            </h2>
          </div>

          {filteredSubmissions.length === 0 ? (
            <div className="px-6 py-12 text-center text-slate-400 text-sm">
              No submissions yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-xs text-slate-400 border-b border-white/10">
                    <th className="px-6 py-3 font-semibold">Date</th>
                    <th className="px-6 py-3 font-semibold">Type</th>
                    <th className="px-6 py-3 font-semibold">Name</th>
                    <th className="px-6 py-3 font-semibold">Email</th>
                    <th className="px-6 py-3 font-semibold">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="px-6 py-4 text-slate-300 whitespace-nowrap">
                        {formatDate(sub.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-[#2563eb]/20 text-[#3b82f6] text-xs font-bold px-2.5 py-1 rounded-full">
                          {typeLabel(sub.type)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">
                        {sub.data.name || sub.data.fullName || '—'}
                      </td>
                      <td className="px-6 py-4 text-slate-300">{sub.data.email || '—'}</td>
                      <td className="px-6 py-4 text-slate-400 max-w-xs">
                        <p className="truncate">
                          {sub.data.subject ||
                            sub.data.service ||
                            sub.data.message ||
                            sub.data.phone ||
                            '—'}
                        </p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number;
}) {
  return (
    <div className="bg-[#131e28] border border-white/10 rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#2563eb]/20 flex items-center justify-center">
          <Icon className="w-5 h-5 text-[#3b82f6]" />
        </div>
        <div>
          <p className="text-xs text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  );
}
