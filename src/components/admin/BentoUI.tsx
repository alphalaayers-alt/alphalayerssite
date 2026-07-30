import React from 'react';

export function BentoCard({
  children,
  className = '',
  span = '',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  span?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      {...props}
      className={`rounded-[1.75rem] border border-white/8 bg-gradient-to-br from-[#15202b] to-[#101820] p-5 sm:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.25)] ${span} ${className}`}
    >
      {children}
    </div>
  );
}

export function BentoGrid({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 ${className}`}>
      {children}
    </div>
  );
}

export function BentoTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-5">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">{title}</h2>
        {subtitle && <p className="text-sm text-slate-400 mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function BentoStat({
  icon: Icon,
  label,
  value,
  accent = 'blue',
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: number | string;
  accent?: 'blue' | 'green' | 'purple' | 'amber';
}) {
  const accents = {
    blue: 'from-[#2563eb]/30 to-[#1d4ed8]/10 text-[#60a5fa]',
    green: 'from-emerald-500/25 to-emerald-700/10 text-emerald-300',
    purple: 'from-violet-500/25 to-violet-700/10 text-violet-300',
    amber: 'from-amber-500/25 to-amber-700/10 text-amber-300',
  };

  return (
    <BentoCard className="min-h-[140px] flex flex-col justify-between">
      <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${accents[accent]} flex items-center justify-center`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs uppercase tracking-[0.14em] text-slate-400 font-semibold">{label}</p>
        <p className="text-3xl sm:text-4xl font-bold text-white mt-1 tabular-nums">{value}</p>
      </div>
    </BentoCard>
  );
}

export function BentoInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={`w-full bg-[#0d151c]/80 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]/60 focus:ring-2 focus:ring-[#2563eb]/20 ${props.className || ''}`}
    />
  );
}

export function BentoTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full bg-[#0d151c]/80 border border-white/10 rounded-2xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#3b82f6]/60 focus:ring-2 focus:ring-[#2563eb]/20 ${props.className || ''}`}
    />
  );
}

export function BentoButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'ghost' | 'danger' | 'soft';
}) {
  const styles = {
    primary: 'bg-[#2563eb] hover:bg-[#1d4ed8] text-white font-semibold',
    ghost: 'bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200',
    soft: 'bg-[#18232c] hover:bg-[#1e2c38] border border-white/10 text-slate-200',
    danger: 'bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-300',
  };
  return (
    <button
      {...props}
      className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl text-sm transition-all disabled:opacity-50 ${styles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
