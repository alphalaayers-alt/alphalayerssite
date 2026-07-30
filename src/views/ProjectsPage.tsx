'use client';

import React, { useMemo, useState } from 'react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useSiteContent } from '../components/SiteContentProvider';

interface ProjectsPageProps {
  onOpenQuote: (projectTitle: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({ onOpenQuote }) => {
  const { content } = useSiteContent();
  const page = content.pages.projects;
  const projectsData = content.collections.projects;
  const [activeTab, setActiveTab] = useState('All');
  const categories = useMemo(
    () => ['All', ...Array.from(new Set(projectsData.map((p) => p.category)))],
    [projectsData]
  );

  const filteredProjects = activeTab === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === activeTab);

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

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-4">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === cat
                    ? 'bg-[#2563eb] text-white shadow-lg scale-105'
                    : 'bg-[#18232c] text-slate-300 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="bg-[#131e28] border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:border-[#2563eb]/50 transition-all duration-300 group flex flex-col justify-between"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#2563eb] text-white font-bold text-xs px-3.5 py-1 rounded-full">
                  {proj.category}
                </div>
              </div>

              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                    <span>Client: <strong className="text-white">{proj.client}</strong></span>
                    <span>{proj.year}</span>
                  </div>

                  <h3 className="text-2xl font-bold text-white group-hover:text-[#3b82f6] transition-colors leading-snug">
                    {proj.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mt-2">
                    {proj.description}
                  </p>
                </div>

                <div className="bg-[#182531] p-3 rounded-xl border border-white/10 text-xs text-[#3b82f6] font-bold">
                  ⚡ Business Impact: {proj.impact}
                </div>

                <button
                  onClick={() => onOpenQuote(`Case Study Inquiry: ${proj.title}`)}
                  className="w-full bg-white/5 hover:bg-[#2563eb] hover:text-white text-white font-bold py-3 rounded-2xl flex items-center justify-center gap-2 transition-all cursor-pointer text-xs"
                >
                  <span>{page.caseStudyCtaLabel}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
