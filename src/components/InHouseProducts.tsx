'use client';

import React from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useSiteContent } from './SiteContentProvider';

interface InHouseProductsProps {
  onOpenQuote: (productTitle: string) => void;
  onViewAllProducts?: () => void;
}

export const InHouseProducts: React.FC<InHouseProductsProps> = ({ onOpenQuote, onViewAllProducts }) => {
  const { content } = useSiteContent();
  const section = content.home.productsSection;
  const productsData = content.collections.products;

  return (
    <section id="products-section" className="bg-[#0b1218] text-white py-20 px-4 sm:px-8 lg:px-12 border-t border-white/5">
      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <span className="bg-[#2563eb]/20 text-[#3b82f6] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
              {section.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              {section.headline}
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed">
              {section.description}
            </p>
          </div>

          {onViewAllProducts && (
            <button
              onClick={onViewAllProducts}
              className="bg-[#18232c] hover:bg-white/10 text-[#3b82f6] border border-[#2563eb]/40 font-bold px-6 py-3 rounded-full text-xs sm:text-sm flex items-center gap-2 transition-all self-start md:self-auto cursor-pointer"
            >
              <span>{section.viewAllLabel}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {productsData.map((prod) => (
            <div
              key={prod.id}
              className="bg-[#131e28] border border-white/10 rounded-3xl p-6 flex flex-col justify-between space-y-6 hover:border-[#2563eb]/50 transition-all duration-300 group shadow-xl hover:-translate-y-1"
            >
              <div className="space-y-4">
                
                {/* Image Showcase */}
                <div className="relative rounded-2xl overflow-hidden h-48 border border-white/10">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-[#2563eb] text-white font-bold text-[10px] uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    {prod.badge}
                  </div>
                  <div className="absolute bottom-3 right-3 bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold px-3 py-1 rounded-full border border-white/10">
                    {prod.metrics}
                  </div>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#3b82f6] transition-colors">
                    {prod.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-medium mt-1 leading-snug">
                    {prod.tagline}
                  </p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-400 leading-relaxed">
                  {prod.description}
                </p>

                {/* Feature Bullets */}
                <ul className="space-y-2 pt-2 border-t border-white/10">
                  {prod.features.map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#2563eb] flex-shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

              </div>

              {/* Action Button */}
              <button
                onClick={() => onOpenQuote(`Demo: ${prod.title}`)}
                className="w-full bg-[#182531] hover:bg-[#2563eb] hover:text-white text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
              >
                <span>Request Live Demo</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
