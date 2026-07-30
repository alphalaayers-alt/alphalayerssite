'use client';

import React from 'react';
import {
  ArrowUpRight,
  DollarSign,
  Calculator,
  BarChart3,
  ArrowRight,
  Settings,
  Compass,
  Cpu,
} from 'lucide-react';
import { useSiteContent } from './SiteContentProvider';

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
  onLearnMore: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  DollarSign,
  Calculator,
  BarChart3,
  Settings,
  Compass,
  Cpu,
};

export const Services: React.FC<ServicesProps> = ({ onSelectService, onLearnMore }) => {
  const { content } = useSiteContent();
  const teaser = content.home.servicesTeaser;

  return (
    <section id="services" className="bg-white text-slate-900 py-20 px-4 sm:px-8 lg:px-12">
      <div className="max-w-[1500px] mx-auto space-y-12">
        <div className="space-y-4">
          <span className="bg-[#2563eb]/10 text-[#2563eb] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
            {teaser.badge}
          </span>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">
            <h2 className="lg:col-span-7 text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              {teaser.headline}
            </h2>

            <div className="lg:col-span-5 flex flex-col items-start gap-4">
              <p className="text-slate-600 text-sm leading-relaxed">{teaser.blurb}</p>

              <button
                onClick={onLearnMore}
                className="bg-[#2563eb] text-white font-bold px-6 py-3 rounded-full flex items-center gap-2.5 hover:bg-[#1d4ed8] transition-all cursor-pointer shadow-md hover:scale-105 text-sm"
              >
                <span>{teaser.ctaLabel}</span>
                <div className="w-5 h-5 rounded-full bg-white text-[#2563eb] flex items-center justify-center">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {teaser.cards.map((card) => {
            const IconComponent = ICON_MAP[card.icon] || DollarSign;
            return (
              <div
                key={card.id}
                onClick={() => onSelectService(card.title)}
                className="relative rounded-3xl overflow-hidden shadow-lg border border-slate-100 group cursor-pointer h-96 flex flex-col justify-end"
              >
                <img
                  src={card.image}
                  alt={card.title}
                  referrerPolicy="no-referrer"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent" />
                <div className="relative z-10 m-4 p-4 rounded-2xl bg-[#131e28]/95 backdrop-blur-md border border-white/10 text-white flex items-center justify-between gap-3 group-hover:bg-[#182633] transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 font-bold">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-[#3b82f6] transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{card.desc}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-white/10 text-white group-hover:bg-[#2563eb] group-hover:text-white flex items-center justify-center transition-colors flex-shrink-0">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
