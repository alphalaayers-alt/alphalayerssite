'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Clock, Calendar, User, X } from 'lucide-react';
import { BlogPost } from '../types';
import { useBlogPosts } from '../lib/use-blog-posts';
import { useSiteContent } from './SiteContentProvider';

interface BlogSectionProps {
  onViewAllBlogs?: () => void;
}

export const BlogSection: React.FC<BlogSectionProps> = ({ onViewAllBlogs }) => {
  const posts = useBlogPosts();
  const { content } = useSiteContent();
  const section = content.home.blogSection;
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  return (
    <section id="blog-section" className="bg-[#0d151c] text-white py-20 px-4 sm:px-8 lg:px-12 border-t border-white/5">
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

          {onViewAllBlogs && (
            <button
              onClick={onViewAllBlogs}
              className="bg-[#18232c] hover:bg-white/10 text-[#3b82f6] border border-[#2563eb]/40 font-bold px-6 py-3 rounded-full text-xs sm:text-sm flex items-center gap-2 transition-all self-start md:self-auto cursor-pointer"
            >
              <span>{section.viewAllLabel}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Blog Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-[#131e28] border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:border-[#2563eb]/50 transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1"
            >
              <div>
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-[#2563eb] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-md">
                    {post.category}
                  </div>
                </div>

                {/* Body */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-4 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#3b82f6]" />
                      {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#3b82f6]" />
                      {post.readTime}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-[#3b82f6] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

              {/* Author Footer */}
              <div className="p-6 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                <div className="flex items-center gap-2.5">
                  <img
                    src={post.author.avatar}
                    alt={post.author.name}
                    referrerPolicy="no-referrer"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-xs text-slate-300 font-semibold">{post.author.name}</span>
                </div>

                <div className="w-8 h-8 rounded-full bg-white/5 text-[#3b82f6] group-hover:bg-[#2563eb] group-hover:text-white flex items-center justify-center transition-colors">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>

            </article>
          ))}
        </div>

      </div>

      {/* Reader Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#131e28] border border-white/10 rounded-3xl max-w-2xl w-full text-white relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between p-5 border-b border-white/10 bg-[#0d151c]">
              <span className="bg-[#2563eb] text-white font-bold text-xs px-3 py-1 rounded-full uppercase">
                {selectedPost.category}
              </span>
              <button
                onClick={() => setSelectedPost(null)}
                className="text-slate-400 hover:text-white bg-white/5 p-1.5 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                {selectedPost.title}
              </h2>

              <div className="flex items-center justify-between py-3 border-y border-white/10 text-xs text-slate-400">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedPost.author.avatar}
                    alt={selectedPost.author.name}
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-white font-bold">{selectedPost.author.name}</p>
                    <p className="text-[11px] text-slate-400">{selectedPost.author.role}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span>{selectedPost.date}</span>
                  <span>•</span>
                  <span>{selectedPost.readTime}</span>
                </div>
              </div>

              <div className="rounded-2xl overflow-hidden h-64 border border-white/10">
                <img
                  src={selectedPost.image}
                  alt={selectedPost.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                {selectedPost.excerpt}
              </p>

              <div className="bg-[#182531] p-4 rounded-2xl border border-white/10 text-xs text-slate-300 space-y-2">
                <p className="font-bold text-white text-sm">Key Executive Takeaway:</p>
                <p>Enterprise modernizations require a balanced synergy between AI technology, automated cloud operations, and rigorous risk control frameworks.</p>
              </div>
            </div>

          </div>
        </div>
      )}

    </section>
  );
};
