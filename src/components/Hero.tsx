"use client";

import React, { useEffect, useMemo, useState } from "react";
import { ArrowRight, Play, CheckCircle2, Plus } from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";

interface HeroProps {
  onOpenQuote: () => void;
  onOpenVideo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenQuote, onOpenVideo }) => {
  const { content } = useSiteContent();
  const hero = content.home.hero;
  const serviceImages = useMemo(
    () => content.home.servicesTeaser.cards.map((card) => card.image),
    [content.home.servicesTeaser.cards]
  );
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (serviceImages.length === 0) return;
    const interval = window.setInterval(() => {
      setCurrentImageIndex(
        (prevIndex) => (prevIndex + 1) % serviceImages.length
      );
    }, 10000);
    return () => window.clearInterval(interval);
  }, [serviceImages.length]);

  const heroImage = serviceImages[currentImageIndex] || hero.image;

  return (
    <section
      id="home"
      className="relative bg-[#0d151c] text-white pt-12 pb-20 px-4 sm:px-8 lg:px-12 overflow-hidden min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)]"
    >
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7 flex flex-col items-start space-y-6 z-10">
          <div className="inline-flex items-center gap-2 bg-[#18232c] border border-white/10 px-4 py-1.5 rounded-full text-xs font-semibold text-slate-300">
            <span>{hero.welcomeTag}</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-white leading-[1.12]">
            {hero.headline}{" "}
            <span className="text-[#3b82f6] font-semibold">
              {hero.headlineAccent}
            </span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl">
            {hero.description}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onOpenQuote}
              id="hero-get-started-btn"
              className="bg-[#2563eb] text-white font-bold px-7 py-3.5 rounded-full flex items-center gap-3 hover:bg-[#1d4ed8] shadow-lg shadow-[#2563eb]/25 transition-all cursor-pointer hover:scale-105"
            >
              <span>{hero.primaryCta}</span>
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

          <div className="pt-8 border-t border-white/10 w-full">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-300">
                {hero.teamLabel}
              </span>
              <div className="flex items-center -space-x-3">
                {hero.teamAvatars.map((url, idx) => (
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

        <div className="lg:col-span-5 relative flex flex-col items-center lg:items-end">
          <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl border border-white/10 group h-[24rem] sm:h-[30rem]">
            {serviceImages.length > 0 ? (
              serviceImages.map((image, index) => (
                <img
                  key={`${image}-${index}`}
                  src={image}
                  alt={`${content.brand.name} hero ${index + 1}`}
                  referrerPolicy="no-referrer"
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out ${
                    index === currentImageIndex ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))
            ) : (
              <img
                src={hero.image}
                alt={`${content.brand.name} hero`}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
