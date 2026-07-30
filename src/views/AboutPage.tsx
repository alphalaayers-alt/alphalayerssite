'use client';

import React from 'react';
import { Target, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSiteContent } from '../components/SiteContentProvider';

interface AboutPageProps {
  onOpenQuote: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onOpenQuote }) => {
  const { content } = useSiteContent();
  const page = content.pages.about;
  const team = content.collections.team;

  return (
    <div className="bg-[#0d151c] text-white py-16 px-4 sm:px-8 lg:px-12 space-y-20 animate-in fade-in duration-300">
      <div className="max-w-[1500px] mx-auto space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="bg-[#2563eb]/20 text-[#3b82f6] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
            {page.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">{page.headline}</h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">{page.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-[#131e28] border border-white/10 p-8 rounded-3xl space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center font-bold">
              <Compass className="w-7 h-7 stroke-[2.2]" />
            </div>
            <h3 className="text-2xl font-bold text-white">{page.missionTitle}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{page.missionBody}</p>
          </div>

          <div className="bg-[#131e28] border border-white/10 p-8 rounded-3xl space-y-4 shadow-xl">
            <div className="w-14 h-14 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center font-bold">
              <Target className="w-7 h-7 stroke-[2.2]" />
            </div>
            <h3 className="text-2xl font-bold text-white">{page.visionTitle}</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{page.visionBody}</p>
          </div>
        </div>

        <div className="space-y-8 pt-8">
          <div className="text-center max-w-xl mx-auto space-y-2">
            <span className="text-[#3b82f6] text-xs font-bold uppercase tracking-wider">{page.teamEyebrow}</span>
            <h2 className="text-3xl font-extrabold text-white">{page.teamHeadline}</h2>
            <p className="text-xs text-slate-400">{page.teamSubtext}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member) => (
              <div
                key={member.id}
                className="bg-[#131e28] border border-white/10 rounded-3xl overflow-hidden p-4 space-y-4 group hover:border-[#2563eb]/50 transition-all"
              >
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

        <div className="bg-gradient-to-r from-[#182531] to-[#131e28] p-8 sm:p-12 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">{page.ctaHeadline}</h3>
            <p className="text-xs sm:text-sm text-slate-300">{page.ctaSubtext}</p>
          </div>
          <button
            onClick={onOpenQuote}
            className="bg-[#2563eb] text-white font-bold px-8 py-3.5 rounded-full flex items-center gap-2 hover:bg-[#1d4ed8] transition-all flex-shrink-0 shadow-lg hover:scale-105 cursor-pointer text-sm"
          >
            <span>{page.ctaButtonLabel}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
