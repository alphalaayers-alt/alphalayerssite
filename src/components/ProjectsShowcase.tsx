'use client';

import React, { useMemo, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { useSiteContent } from './SiteContentProvider';

interface ProjectsShowcaseProps {
  onOpenQuote: (projectTitle: string) => void;
  onViewAllProjects?: () => void;
}

export const ProjectsShowcase: React.FC<ProjectsShowcaseProps> = ({ onOpenQuote, onViewAllProjects }) => {
  const { content } = useSiteContent();
  const section = content.home.projectsSection;
  const projectsData = content.collections.projects;
  const [activeTab, setActiveTab] = useState<string>('All');

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(projectsData.map((p) => p.category)))],
    [projectsData]
  );

  const filteredProjects = activeTab === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === activeTab);

  return (
    <section id="projects-section" className="bg-[#0d151c] text-white py-20 px-4 sm:px-8 lg:px-12 border-t border-white/5">
      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Header */}
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

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === cat
                    ? 'bg-[#2563eb] text-white font-bold shadow-md'
                    : 'bg-[#18232c] text-slate-300 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="group bg-[#131e28] border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:border-[#2563eb]/50 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Image & Overlay */}
              <div className="relative h-64 overflow-hidden">
                <img
                  src={proj.image}
                  alt={proj.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#131e28] via-transparent to-black/30" />
                
                <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md text-[#3b82f6] font-semibold text-xs px-3.5 py-1.5 rounded-full border border-white/10">
                  {proj.category} • {proj.year}
                </div>

                <div className="absolute bottom-4 left-4 right-4 bg-[#182531]/95 backdrop-blur-md p-3.5 rounded-2xl border border-white/10">
                  <p className="text-xs font-bold text-[#3b82f6] uppercase tracking-wider">
                    Client: {proj.client}
                  </p>
                  <p className="text-xs text-white font-medium mt-0.5">
                    ⚡ {proj.impact}
                  </p>
                </div>
              </div>

              {/* Content Body */}
              <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-[#3b82f6] transition-colors leading-snug">
                    {proj.title}
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mt-2">
                    {proj.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-slate-400 font-medium">Enterprise Solution</span>
                  <button
                    onClick={() => onOpenQuote(`Case Study: ${proj.title}`)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3b82f6] hover:underline cursor-pointer"
                  >
                    <span>Read Full Case Study</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

        {onViewAllProjects && (
          <div className="text-center pt-4">
            <button
              onClick={onViewAllProjects}
              className="bg-[#2563eb] text-white font-bold px-8 py-3.5 rounded-full text-sm inline-flex items-center gap-2 hover:bg-[#1d4ed8] transition-all cursor-pointer shadow-lg hover:scale-105"
            >
              <span>{section.viewAllLabel}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
