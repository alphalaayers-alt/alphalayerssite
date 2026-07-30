'use client';

import React, { useState } from 'react';
import { Clock, Calendar, ArrowUpRight, X } from 'lucide-react';
import { BlogPost } from '../types';
import { useBlogPosts } from '../lib/use-blog-posts';
import { useSiteContent } from '../components/SiteContentProvider';

export const BlogPage: React.FC = () => {
  const posts = useBlogPosts();
  const { content } = useSiteContent();
  const page = content.pages.blog;
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

          {/* Search Bar */}
          <div className="max-w-md mx-auto pt-4">
            <input
              type="text"
              placeholder={page.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#18232c] border border-white/10 rounded-full px-5 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2563eb] shadow-lg"
            />
          </div>
        </div>

        {/* Blog Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article
              key={post.id}
              onClick={() => setSelectedPost(post)}
              className="bg-[#131e28] border border-white/10 rounded-3xl overflow-hidden shadow-xl hover:border-[#2563eb]/50 transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1"
            >
              <div>
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

                  <h3 className="text-xl font-bold text-white group-hover:text-[#3b82f6] transition-colors leading-snug">
                    {post.title}
                  </h3>

                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
              </div>

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

      {/* Post Modal */}
      {selectedPost && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-[#131e28] border border-white/10 rounded-3xl max-w-2xl w-full text-white relative shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
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
                <div>{selectedPost.date} • {selectedPost.readTime}</div>
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
                <p className="font-bold text-white text-sm">Strategic Insight:</p>
                <p>Organizations that integrate zero-trust cybersecurity alongside real-time SaaS financial dashboards report 40% higher operational agility during market shifts.</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
