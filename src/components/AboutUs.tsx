'use client';

import React from 'react';
import { Target, Compass, CheckCircle2, ArrowRight } from 'lucide-react';
import { useSiteContent } from './SiteContentProvider';

interface AboutUsProps {
  onLearnMore: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onLearnMore }) => {
  const { content } = useSiteContent();
  const about = content.home.aboutTeaser;

  return (
    <section id="about" className="bg-white text-slate-900 py-20 px-4 sm:px-8 lg:px-12">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        <div className="lg:col-span-6 flex flex-col gap-8">
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-100">
            <img
              src={about.image}
              alt={`${content.brand.name} team`}
              referrerPolicy="no-referrer"
              className="w-full h-80 sm:h-96 object-cover hover:scale-103 transition-transform duration-500"
            />
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
              <Target className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{about.visionTitle}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{about.visionText}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 flex flex-col gap-8">
          <div className="flex flex-col items-start gap-4">
            <span className="bg-[#2563eb]/10 text-[#2563eb] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider">
              {about.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              {about.headline}
            </h2>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{about.missionTitle}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{about.missionText}</p>
            </div>
          </div>

          <div className="bg-[#131e28] text-white p-5 sm:p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2563eb]/20 text-[#3b82f6] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">{about.ctaText}</p>
            </div>

            <button
              onClick={onLearnMore}
              className="bg-[#2563eb] text-white font-bold px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#1d4ed8] transition-all flex-shrink-0 text-xs sm:text-sm cursor-pointer shadow-md hover:scale-105"
            >
              <span>{about.ctaLabel}</span>
              <div className="w-5 h-5 rounded-full bg-white text-[#2563eb] flex items-center justify-center">
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
