import React from 'react';
import { ArrowRight, Play, CheckCircle2, Plus } from 'lucide-react';

interface HeroProps {
  onOpenQuote: () => void;
  onOpenVideo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuote, onOpenVideo }) => {
  const heroImage = '/src/assets/images/hero_mobile_mockup_1785300358613.jpg';

  const teamAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  ];

  return (
    <section id="home" className="relative bg-[#0d151c] text-white pt-12 pb-20 px-4 sm:px-8 lg:px-12 overflow-hidden">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Content Column */}
        <div className="lg:col-span-6 flex flex-col items-start space-y-6 z-10">
          
          {/* Welcome Tag */}
          <div className="inline-flex items-center gap-2 bg-[#18232c] border border-white/10 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300">
            <span>Welcome To Alpha Layers</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
            Where Technical Precision Meets <span className="text-[#3b82f6]">Excellence</span>
          </h1>

          {/* Description Paragraph */}
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
            Empowering global enterprises with custom software engineering, cloud infrastructure, and innovative IT agency solutions.
          </p>

          {/* CTA Buttons Row */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOpenQuote}
              id="hero-get-started-btn"
              className="bg-[#2563eb] text-white font-bold px-7 py-3.5 rounded-full flex items-center gap-3 hover:bg-[#1d4ed8] shadow-lg shadow-[#2563eb]/25 transition-all cursor-pointer hover:scale-105"
            >
              <span>Let's Get Started</span>
              <div className="w-7 h-7 rounded-full bg-white text-[#2563eb] flex items-center justify-center">
                <ArrowRight className="w-4 h-4" />
              </div>
            </button>

            <button
              onClick={onOpenVideo}
              id="hero-play-video-btn"
              className="w-13 h-13 rounded-full bg-[#18232c] text-white border border-white/20 flex items-center justify-center hover:bg-white/10 hover:border-[#2563eb] transition-all cursor-pointer shadow-md group"
              aria-label="Play video"
            >
              <Play className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform ml-0.5" />
            </button>
          </div>

          {/* Team Stack Row */}
          <div className="pt-8 border-t border-white/10 w-full">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-300">Join Our Team Now:</span>
              <div className="flex items-center -space-x-3">
                {teamAvatars.map((url, idx) => (
                  <img
                    key={idx}
                    src={url}
                    alt="Team member"
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full border-2 border-[#0d151c] object-cover shadow-sm"
                  />
                ))}
                <div className="w-10 h-10 rounded-full bg-[#2563eb] text-white border-2 border-[#0d151c] flex items-center justify-center font-bold text-lg shadow-sm hover:scale-110 transition-transform cursor-pointer">
                  <Plus className="w-5 h-5 stroke-[3]" />
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Hero Graphics Column */}
        <div className="lg:col-span-6 relative flex flex-col items-center lg:items-end">
          <div className="w-full max-w-lg flex flex-col">
            {/* Top Floating Badge */}
            <div className="mb-4 w-full bg-[#18232c] border border-white/15 px-5 py-2.5 rounded-full flex items-center gap-3 shadow-xl z-20">
              <div className="w-6 h-6 rounded-full bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="text-xs sm:text-sm font-semibold text-slate-200 leading-snug">
                Guiding Financial Journey To Elevating Your Business Destiny
              </span>
            </div>

            {/* Main Visual Image Showcase (Mobile App Mockup) */}
            <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 group">
            <img
              src={heroImage}
              alt="Financial Mobile App Dashboard Mockups"
              referrerPolicy="no-referrer"
              className="w-full h-auto object-cover transform group-hover:scale-102 transition-transform duration-500"
            />

            {/* Floating Experience Card */}
            <div className="absolute bottom-6 right-6 bg-[#2563eb] text-white p-5 sm:p-6 rounded-2xl shadow-2xl max-w-[170px] border border-white/20 transform hover:-translate-y-1 transition-transform">
              <div className="text-4xl sm:text-5xl font-black tracking-tight leading-none mb-1 text-white">
                25+
              </div>
              <p className="text-xs font-bold leading-tight uppercase tracking-wider text-blue-100">
                Years Of Experience
              </p>
            </div>
          </div>

          </div>

        </div>

      </div>
    </section>
  );
};
