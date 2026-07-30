'use client';

import React from 'react';
import { ArrowUpRight, CheckCircle2, Settings, Compass, DollarSign, Cpu, Calculator, BarChart3 } from 'lucide-react';
import { useSiteContent } from '../components/SiteContentProvider';

interface ServicesPageProps {
  onOpenQuote: (serviceTitle: string) => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({ onOpenQuote }) => {
  const { content } = useSiteContent();
  const page = content.pages.services;
  const servicesData = content.collections.services;

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Settings': return Settings;
      case 'Compass': return Compass;
      case 'DollarSign': return DollarSign;
      case 'Cpu': return Cpu;
      case 'Calculator': return Calculator;
      case 'BarChart3': return BarChart3;
      default: return Settings;
    }
  };

  return (
    <div className="bg-[#0d151c] text-white py-16 px-4 sm:px-8 lg:px-12 space-y-16 animate-in fade-in duration-300">
      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="bg-[#2563eb]/20 text-[#3b82f6] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
            {page.badge}
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            {page.headline}
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            {page.description}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesData.map((srv) => {
            const IconComponent = getIcon(srv.icon);
            return (
              <div
                key={srv.id}
                className="bg-[#131e28] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 hover:border-[#2563eb]/50 transition-all duration-300 group shadow-xl hover:-translate-y-1"
              >
                <div className="space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center font-bold shadow-md group-hover:scale-105 transition-transform">
                    <IconComponent className="w-7 h-7 stroke-[2.2]" />
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-[#3b82f6] uppercase tracking-wider">
                      {srv.category}
                    </span>
                    <h3 className="text-2xl font-bold text-white group-hover:text-[#3b82f6] transition-colors mt-0.5">
                      {srv.title}
                    </h3>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed">
                    {srv.fullDesc}
                  </p>

                  <div className="pt-2 border-t border-white/10">
                    <p className="text-xs font-bold text-slate-200 mb-2">Key Service Offerings:</p>
                    <ul className="space-y-1.5">
                      {srv.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-400">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2563eb] flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <button
                  onClick={() => onOpenQuote(srv.title)}
                  className="w-full bg-[#182531] hover:bg-[#2563eb] hover:text-white text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs shadow-md"
                >
                  <span>{page.inquireLabel}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
