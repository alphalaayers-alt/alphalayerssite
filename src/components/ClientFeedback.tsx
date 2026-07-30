'use client';

import React from 'react';
import { Star, Quote } from 'lucide-react';
import { useSiteContent } from './SiteContentProvider';

export const ClientFeedback: React.FC = () => {
  const { content } = useSiteContent();
  const section = content.home.testimonialsSection;
  const testimonialsData = content.collections.testimonials;

  return (
    <section className="bg-[#0b1218] text-white py-20 px-4 sm:px-8 lg:px-12 border-t border-white/5">
      <div className="max-w-[1500px] mx-auto space-y-12">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="bg-[#2563eb]/20 text-[#3b82f6] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
            {section.badge}
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">{section.headline}</h2>
          <p className="text-slate-400 text-sm leading-relaxed">{section.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((item) => (
            <div
              key={item.id}
              className="bg-[#131e28] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 relative group hover:border-[#2563eb]/50 transition-all duration-300 shadow-xl"
            >
              <Quote className="w-10 h-10 text-[#2563eb]/20 absolute top-6 right-6" />

              <div className="space-y-4 relative z-10">
                <div className="flex text-[#2563eb]">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#2563eb] text-[#2563eb]" />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed italic">&ldquo;{item.content}&rdquo;</p>
              </div>

              <div className="flex items-center gap-3 pt-2 border-t border-white/10 relative z-10">
                <img
                  src={item.avatar}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#2563eb]/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{item.name}</h4>
                  <p className="text-[11px] text-slate-400">
                    {item.role}, {item.company}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
