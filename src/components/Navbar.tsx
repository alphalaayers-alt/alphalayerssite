'use client';

import React, { useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { useSiteContent } from './SiteContentProvider';

interface NavbarProps {
  onOpenQuote: () => void;
  activePage: string;
  setActivePage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenQuote, activePage, setActivePage }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { content } = useSiteContent();
  const mainNavItems = content.nav.items.filter((item) => item.visible);

  const handleNavClick = (id: string) => {
    setActivePage(id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#0d151c] border-b border-white/5 px-4 sm:px-8 lg:px-12 py-2 shadow-sm h-14 sm:h-16">
      <div className="max-w-[1500px] mx-auto flex items-center justify-between">
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center cursor-pointer group pr-2 sm:pr-4"
          id="navbar-logo"
        >
          <img
            src={content.brand.logoNav}
            alt={content.brand.name}
            className="h-10 sm:h-12 w-auto min-w-[13rem] sm:min-w-[15rem] object-contain object-left"
          />
        </div>

        <nav className="hidden lg:flex items-center bg-[#18232c] border border-white/10 rounded-full px-5 py-2">
          <ul className="flex items-center gap-4 xl:gap-6 text-xs xl:text-sm font-medium">
            {mainNavItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={`transition-colors duration-200 hover:text-white px-3.5 py-1.5 rounded-full cursor-pointer whitespace-nowrap ${
                    activePage === item.id
                      ? 'bg-[#2563eb] text-white font-semibold'
                      : 'text-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li>
              <button
                onClick={() => handleNavClick('contact')}
                className={`transition-colors duration-200 hover:text-white px-3.5 py-1.5 rounded-full cursor-pointer whitespace-nowrap ${
                  activePage === 'contact' ? 'bg-[#2563eb] text-white font-semibold' : 'text-slate-300'
                }`}
              >
                {content.nav.contactLabel}
              </button>
            </li>
          </ul>
        </nav>

        <div className="hidden sm:flex items-center">
          <button
            onClick={onOpenQuote}
            id="navbar-quote-btn"
            className="bg-[#2563eb] text-white font-semibold px-5 py-2.5 rounded-full flex items-center gap-2.5 hover:bg-[#1d4ed8] transition-all shadow-md group cursor-pointer hover:scale-105"
          >
            <span className="text-xs sm:text-sm">{content.nav.ctaLabel}</span>
            <div className="w-6 h-6 rounded-full bg-white text-[#2563eb] flex items-center justify-center group-hover:bg-slate-100 transition-colors">
              <ArrowUpRight className="w-3.5 h-3.5" />
            </div>
          </button>
        </div>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden text-slate-200 p-2 rounded-lg bg-[#18232c] hover:bg-[#18232c]/80 border border-white/10 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 px-2 pt-2 border-t border-white/10 flex flex-col gap-2 bg-[#111921] rounded-2xl p-4 shadow-lg border border-white/10">
          {mainNavItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
                activePage === item.id ? 'bg-[#2563eb] text-white font-bold' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => handleNavClick('contact')}
            className={`text-left py-2.5 px-3 rounded-lg text-sm font-medium ${
              activePage === 'contact' ? 'bg-[#2563eb] text-white font-bold' : 'text-slate-200 hover:bg-white/10'
            }`}
          >
            {content.nav.contactLabel}
          </button>
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenQuote();
              }}
              className="w-full bg-[#2563eb] text-white font-bold py-3 rounded-full flex items-center justify-center gap-2 shadow-lg hover:bg-[#1d4ed8]"
            >
              <span>{content.nav.ctaLabel}</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
