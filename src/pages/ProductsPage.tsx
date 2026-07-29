import React from 'react';
import { ArrowUpRight, CheckCircle2, ShieldCheck, Zap, Server } from 'lucide-react';
import { productsData } from '../data/mockData';

interface ProductsPageProps {
  onOpenQuote: (productTitle: string) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ onOpenQuote }) => {
  return (
    <div className="bg-[#0d151c] text-white py-16 px-4 sm:px-8 lg:px-12 space-y-16 animate-in fade-in duration-300">
      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="bg-[#2563eb]/20 text-[#3b82f6] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
            In-House Software Products
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Optibiz Proprietary IT Solutions
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Engineered by our in-house software architects to streamline financial data workflows, automate resource planning, and safeguard cloud networks.
          </p>
        </div>

        {/* Detailed Products Showcase */}
        <div className="space-y-12">
          {productsData.map((prod, index) => (
            <div
              key={prod.id}
              className={`bg-[#131e28] border border-white/10 rounded-3xl p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-2xl hover:border-[#2563eb]/50 transition-all ${
                index % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className="lg:col-span-6 space-y-4">
                <div className="inline-flex items-center gap-2 bg-[#2563eb] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  <Zap className="w-3.5 h-3.5" />
                  <span>{prod.badge}</span>
                </div>

                <h2 className="text-3xl font-extrabold text-white leading-tight">
                  {prod.title}
                </h2>

                <p className="text-slate-300 text-sm font-semibold">
                  {prod.tagline}
                </p>

                <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
                  {prod.description}
                </p>

                <div className="bg-[#182531] p-4 rounded-2xl border border-white/10 text-xs text-[#3b82f6] font-bold">
                  Key Impact Metric: {prod.metrics}
                </div>

                <div className="pt-2 space-y-2">
                  <p className="text-xs font-bold text-slate-200">Core Engine Features:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {prod.features.map((feat, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-[#2563eb] flex-shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex flex-wrap gap-4">
                  <button
                    onClick={() => onOpenQuote(`Demo: ${prod.title}`)}
                    className="bg-[#2563eb] text-white font-bold px-7 py-3 rounded-full flex items-center gap-2 hover:bg-[#1d4ed8] transition-all cursor-pointer text-xs shadow-lg hover:scale-105"
                  >
                    <span>Request Product Demo</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="lg:col-span-6">
                <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative group">
                  <img
                    src={prod.image}
                    alt={prod.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
