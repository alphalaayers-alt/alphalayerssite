import React from 'react';
import { Target, Compass, Award, Users, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { teamMembersData } from '../data/mockData';

interface AboutPageProps {
  onOpenQuote: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenQuote }) => {
  return (
    <div className="bg-[#0d151c] text-white py-16 px-4 sm:px-8 lg:px-12 space-y-20 animate-in fade-in duration-300">
      <div className="max-w-[1500px] mx-auto space-y-16">
        
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="bg-[#2563eb]/20 text-[#3b82f6] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
            About Optibiz Enterprise
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Pioneering IT Innovation & Financial Excellence
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Founded in 2002, Optibiz bridges the gap between institutional financial strategy and modern IT software engineering. We empower global corporations to innovate, scale, and stay resilient.
          </p>
        </div>

        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#131e28] border border-white/10 p-8 rounded-3xl space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center font-bold">
              <Compass className="w-7 h-7 stroke-[2.2]" />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Mission</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              To engineer world-class IT software platforms and deliver authoritative financial advisory that transforms enterprise growth, ensures regulatory compliance, and unlocks long-term value.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                Customer-centric software architecture
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                Zero-compromise data privacy & security
              </li>
            </ul>
          </div>

          <div className="bg-[#131e28] border border-white/10 p-8 rounded-3xl space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center font-bold">
              <Target className="w-7 h-7 stroke-[2.2]" />
            </div>
            <h3 className="text-2xl font-bold text-white">Our Vision</h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              To be the premier global IT services & consulting firm recognized for merging artificial intelligence, proprietary SaaS solutions, and financial strategy into unified enterprise platforms.
            </p>
            <ul className="space-y-2 text-xs text-slate-400 pt-2">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                Global cross-border consulting presence
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#2563eb]" />
                Industry-defining proprietary software tools
              </li>
            </ul>
          </div>
        </div>

        {/* Leadership Team Grid */}
        <div className="space-y-8 pt-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[#3b82f6] text-xs font-bold uppercase tracking-wider">Leadership & Experts</span>
            <h2 className="text-3xl font-extrabold text-white">Meet The Minds Behind Optibiz</h2>
            <p className="text-xs text-slate-400">Our multidisciplinary team combines seasoned financial advisors and elite software architects.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembersData.map((member) => (
              <div key={member.id} className="bg-[#131e28] border border-white/10 rounded-3xl overflow-hidden p-4 space-y-4 group hover:border-[#2563eb]/50 transition-all">
                <div className="rounded-2xl overflow-hidden h-60">
                  <img
                    src={member.avatar}
                    alt={member.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white group-hover:text-[#3b82f6] transition-colors">{member.name}</h4>
                  <p className="text-xs text-[#3b82f6] font-semibold">{member.role}</p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA Banner */}
        <div className="bg-gradient-to-r from-[#182531] to-[#131e28] p-8 sm:p-12 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">Ready To Scale Your Organization?</h3>
            <p className="text-xs sm:text-sm text-slate-300">Partner with our senior IT and financial consultants today.</p>
          </div>
          <button
            onClick={onOpenQuote}
            className="bg-[#2563eb] text-white font-bold px-8 py-3.5 rounded-full flex items-center gap-2 hover:bg-[#1d4ed8] transition-all flex-shrink-0 shadow-lg hover:scale-105 cursor-pointer text-sm"
          >
            <span>Consult Our Team</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
