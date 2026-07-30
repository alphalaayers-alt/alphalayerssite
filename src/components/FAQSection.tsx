'use client';

import React, { useMemo, useState } from 'react';
import { ChevronDown, Search, HelpCircle, ArrowRight, Sparkles } from 'lucide-react';
import { useSiteContent } from './SiteContentProvider';

interface FAQSectionProps {
  onOpenQuote?: () => void;
  title?: string;
  subtitle?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onOpenQuote, title, subtitle }) => {
  const { content } = useSiteContent();
  const faqData = content.collections.faqs;
  const faqPage = content.pages.faq;
  const displayTitle = title || faqPage.title;
  const displaySubtitle = subtitle || faqPage.subtitle;

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [openId, setOpenId] = useState<string | null>(faqData[0]?.id || null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(faqData.map((f) => f.category)))],
    [faqData]
  );

  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      searchQuery.trim() === '' ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section id="faq-section" className="py-20 px-4 sm:px-8 lg:px-12 bg-[#0d151c] text-white">
      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#2563eb]/20 text-[#3b82f6] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider">
            <HelpCircle className="w-4 h-4" />
            <span>{faqPage.badge}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            {displayTitle}
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            {displaySubtitle}
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search question or keyword (e.g., Cloud, Pricing, Security)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#131e28] border border-white/10 rounded-2xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2563eb] transition-all shadow-lg"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex items-center justify-center flex-wrap gap-2 pt-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#2563eb] text-white shadow-lg scale-105'
                    : 'bg-[#18232c] text-slate-300 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((item) => {
              const isOpen = openId === item.id;
              return (
                <div
                  key={item.id}
                  className={`border rounded-2xl transition-all duration-300 overflow-hidden ${
                    isOpen
                      ? 'bg-[#131e28] border-[#2563eb]/60 shadow-xl'
                      : 'bg-[#131e28]/70 border-white/10 hover:border-white/20'
                  }`}
                >
                  <button
                    onClick={() => toggleAccordion(item.id)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left cursor-pointer gap-4"
                  >
                    <span className="text-base sm:text-lg font-bold text-white group-hover:text-[#3b82f6] transition-colors">
                      {item.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? 'bg-[#2563eb] text-white rotate-180' : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-5 h-5" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 text-sm text-slate-300 leading-relaxed border-t border-white/5 pt-4 animate-in fade-in duration-200">
                      <p>{item.answer}</p>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-[10px] font-bold text-[#3b82f6] bg-[#2563eb]/10 px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                          Category: {item.category}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-[#131e28] rounded-2xl border border-white/10 space-y-3">
              <HelpCircle className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-sm text-slate-300 font-medium">No questions found matching "{searchQuery}"</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setActiveCategory('All');
                }}
                className="text-xs text-[#3b82f6] underline hover:text-blue-400 cursor-pointer"
              >
                Reset search filters
              </button>
            </div>
          )}
        </div>

        {/* Bottom CTA Box */}
        {onOpenQuote && (
          <div className="max-w-4xl mx-auto bg-gradient-to-r from-[#131e28] via-[#182531] to-[#131e28] border border-[#2563eb]/30 rounded-3xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-2xl">
            <div className="space-y-2 text-center sm:text-left">
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#3b82f6]">
                <Sparkles className="w-4 h-4" />
                <span>{faqPage.ctaEyebrow}</span>
              </div>
              <h3 className="text-xl font-bold text-white">{faqPage.ctaHeadline}</h3>
              <p className="text-xs text-slate-400">{faqPage.ctaSubtext}</p>
            </div>

            <button
              onClick={onOpenQuote}
              className="bg-[#2563eb] text-white font-bold px-7 py-3.5 rounded-full flex items-center gap-2 hover:bg-[#1d4ed8] transition-all flex-shrink-0 shadow-lg hover:scale-105 cursor-pointer text-sm whitespace-nowrap"
            >
              <span>{faqPage.ctaButtonLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
