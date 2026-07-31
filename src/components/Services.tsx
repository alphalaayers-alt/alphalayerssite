"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import {
  ArrowUpRight,
  DollarSign,
  Calculator,
  BarChart3,
  ArrowRight,
  Settings,
  Compass,
  Cpu,
  Smartphone,
  Monitor,
  Sparkles,
  Cloud,
  LayoutDashboard,
  Image,
  Search,
  MessageSquare,
  PenTool,
  Wrench,
  Globe,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useSiteContent } from "./SiteContentProvider";
import { DEFAULT_SITE_CONTENT } from "../lib/site-content-defaults";

interface ServicesProps {
  onSelectService: (serviceTitle: string) => void;
  onLearnMore: () => void;
}

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "Business Strategies": DollarSign,
  "Taxes & Accounting": Calculator,
  "Financial Planning": BarChart3,
  "Mobile App Development": Smartphone,
  "Website Development": Monitor,
  "Custom Software Development": Cpu,
  "AI Automation": Sparkles,
  "SaaS Development": LayoutDashboard,
  "Cloud Solutions": Cloud,
  "UI/UX Design": Image,
  "Graphic Design": PenTool,
  SEO: Search,
  "Social Media Management": MessageSquare,
  "Content Creation": Globe,
  "Maintenance & Support": Wrench,
};

const SERVICE_IMAGES: Record<string, string> = {
  "Mobile App Development":
    "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800&auto=format&fit=crop&q=80",
  "Website Development":
    "https://images.unsplash.com/photo-1547658719-da2b51169166?w=800&auto=format&fit=crop&q=80",
  "Custom Software Development":
    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80",
  "AI Automation":
    "https://images.unsplash.com/photo-1677442136019-21780efad99a?w=800&auto=format&fit=crop&q=80",
  "SaaS Development":
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80",
  "Cloud Solutions":
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
  "UI/UX Design":
    "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=800&auto=format&fit=crop&q=80",
  "Graphic Design":
    "https://images.unsplash.com/photo-1626785774573-4b799315345d?w=800&auto=format&fit=crop&q=80",
  SEO: "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=800&auto=format&fit=crop&q=80",
  "Social Media Management":
    "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&auto=format&fit=crop&q=80",
  "Content Creation":
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&auto=format&fit=crop&q=80",
  "Maintenance & Support":
    "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80",
  "Business Strategies":
    "/src/assets/images/service_business_strategies_1785300397999.jpg",
  "Taxes & Accounting":
    "/src/assets/images/service_taxes_accounting_1785300412746.jpg",
  "Financial Planning":
    "/src/assets/images/service_financial_planning_1785300427909.jpg",
};

export const Services: React.FC<ServicesProps> = ({
  onSelectService,
  onLearnMore,
}) => {
  const { content } = useSiteContent();
  const teaser = content.home.servicesTeaser;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  // Combine teaser cards with default cards to guarantee all services are always shown
  const cards = useMemo(() => {
    const rawCards = [
      ...(teaser?.cards || []),
      ...DEFAULT_SITE_CONTENT.home.servicesTeaser.cards,
    ];

    // Deduplicate cards by title
    const uniqueMap = new Map<
      string,
      (typeof DEFAULT_SITE_CONTENT.home.servicesTeaser.cards)[0]
    >();
    for (const c of rawCards) {
      if (c && c.title && !uniqueMap.has(c.title)) {
        uniqueMap.set(c.title, c);
      }
    }
    return Array.from(uniqueMap.values());
  }, [teaser?.cards]);

  // Auto-slide functionality (slides card-by-card every 3.5 seconds)
  useEffect(() => {
    if (isPaused || cards.length <= 1) return;

    const timer = setInterval(() => {
      if (!scrollRef.current) return;
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      const scrollStep = 344; // card width (320px) + gap (24px)

      if (scrollLeft + clientWidth >= scrollWidth - 20) {
        scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        scrollRef.current.scrollBy({ left: scrollStep, behavior: "smooth" });
      }
    }, 3500);

    return () => clearInterval(timer);
  }, [isPaused, cards.length]);

  const handleScroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollStep = 344;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollStep : scrollStep,
      behavior: "smooth",
    });
  };

  return (
    <section
      id="services"
      className="bg-white text-slate-900 py-20 px-4 sm:px-8 lg:px-12"
    >
      <div className="max-w-[1500px] mx-auto space-y-12">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div className="space-y-6 max-w-3xl">
            <span className="bg-[#2563eb]/10 text-[#2563eb] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
              {teaser.badge}
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              {teaser.headline}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              {teaser.blurb}
            </p>
            <div>
              <button
                onClick={onLearnMore}
                className="bg-[#2563eb] text-white font-bold px-6 py-3 rounded-full inline-flex items-center gap-2.5 hover:bg-[#1d4ed8] transition-all cursor-pointer shadow-md hover:scale-105 text-sm"
              >
                <span>{teaser.ctaLabel}</span>
                <div className="w-5 h-5 rounded-full bg-white text-[#2563eb] flex items-center justify-center">
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            </div>
          </div>

          {/* Slide navigation controls */}
          <div className="flex items-center gap-3 self-end lg:self-auto">
            <button
              onClick={() => handleScroll("left")}
              aria-label="Previous service"
              className="w-11 h-11 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] transition-colors flex items-center justify-center shadow-sm cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll("right")}
              aria-label="Next service"
              className="w-11 h-11 rounded-full border border-slate-200 bg-white text-slate-700 hover:bg-[#2563eb] hover:text-white hover:border-[#2563eb] transition-colors flex items-center justify-center shadow-sm cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Auto-sliding Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div
            ref={scrollRef}
            className="flex gap-6 overflow-x-auto pb-4 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden snap-x snap-mandatory scroll-smooth"
          >
            {cards.map((card) => {
              const IconComponent = ICON_MAP[card.title] || DollarSign;
              const cardImage =
                card.image && card.image.startsWith("http")
                  ? card.image
                  : SERVICE_IMAGES[card.title] ||
                    card.image ||
                    "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80";

              return (
                <div
                  key={card.id}
                  onClick={() => onSelectService(card.title)}
                  className="min-w-[310px] sm:min-w-[340px] snap-start bg-[#131e28] border border-white/10 rounded-3xl p-5 flex flex-col justify-between group cursor-pointer h-[410px] hover:border-[#2563eb]/60 transition-all duration-300 shadow-xl hover:-translate-y-1.5"
                >
                  {/* Top Image Banner */}
                  <div className="relative w-full h-44 rounded-2xl overflow-hidden border border-white/10 shrink-0">
                    <img
                      src={cardImage}
                      alt={card.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent" />
                    <div className="absolute top-3 right-3 w-9 h-9 rounded-xl bg-black/50 backdrop-blur-md border border-white/20 text-[#3b82f6] flex items-center justify-center shadow-md">
                      <IconComponent className="w-4.5 h-4.5" />
                    </div>
                  </div>

                  {/* Card Details Body */}
                  <div className="flex flex-col justify-between flex-1 mt-4 text-white">
                    <div className="space-y-2">
                      <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-[#3b82f6] transition-colors leading-snug">
                        {card.title}
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {card.desc}
                      </p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#3b82f6]">
                        service
                      </span>
                      <div className="w-9 h-9 rounded-full bg-white/10 text-white group-hover:bg-[#2563eb] group-hover:text-white flex items-center justify-center transition-colors">
                        <ArrowUpRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
