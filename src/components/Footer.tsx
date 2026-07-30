'use client';

import React, { useState } from 'react';
import { ArrowRight, Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';
import { Logo } from './Logo';
import { submitForm } from '../lib/submit-form';
import { useSiteContent } from './SiteContentProvider';

interface FooterProps {
  onOpenQuote: () => void;
  setActivePage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActivePage }) => {
  const { content } = useSiteContent();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterStatus, setNewsletterStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleNav = (page: string) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNewsletter = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    const result = await submitForm('newsletter', { email: newsletterEmail.trim() });
    if (result.success) {
      setNewsletterStatus('success');
      setNewsletterEmail('');
    } else {
      setNewsletterStatus('error');
    }
  };

  return (
    <footer id="contact-footer" className="bg-[#0b1218] text-white pt-16 pb-8 border-t border-white/10 px-4 sm:px-8 lg:px-12">
      <div className="max-w-[1500px] mx-auto space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12 pb-12 border-b border-white/10">
          <div className="lg:col-span-4 space-y-4">
            <div onClick={() => handleNav('home')} className="flex items-center cursor-pointer group">
              <Logo variant="dark" size="md" />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">{content.footer.blurb}</p>
            <div className="flex items-center gap-3 pt-2">
              {[Linkedin, Twitter, Facebook, Instagram].map((Icon, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNav('contact')}
                  className="w-9 h-9 rounded-full bg-white/5 hover:bg-[#2563eb] hover:text-white text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                >
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              {content.nav.items.map((item) => (
                <li key={item.id}>
                  <button onClick={() => handleNav(item.id)} className="hover:text-[#3b82f6] transition-colors text-left cursor-pointer">
                    {item.label}
                  </button>
                </li>
              ))}
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-[#3b82f6] transition-colors text-left cursor-pointer">
                  {content.nav.contactLabel}
                </button>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#2563eb] flex-shrink-0" />
                <span>{content.footer.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#2563eb] flex-shrink-0" />
                <span>{content.footer.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#2563eb] flex-shrink-0" />
                <span>{content.footer.email}</span>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{content.footer.newsletterHeading}</h4>
            <p className="text-xs text-slate-400 leading-snug">{content.footer.newsletterBlurb}</p>
            <form onSubmit={handleNewsletter} className="space-y-2 pt-1">
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={newsletterEmail}
                  onChange={(e) => {
                    setNewsletterEmail(e.target.value);
                    setNewsletterStatus('idle');
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#2563eb]"
                />
                <button
                  type="submit"
                  className="w-9 h-9 rounded-full bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 hover:bg-[#1d4ed8] transition-colors cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              {newsletterStatus === 'success' && <p className="text-xs text-green-400">Subscribed successfully!</p>}
              {newsletterStatus === 'error' && <p className="text-xs text-red-400">Failed to subscribe. Try again.</p>}
            </form>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {content.footer.copyrightName}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button onClick={() => handleNav('contact')} className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </button>
            <button onClick={() => handleNav('contact')} className="hover:text-slate-300 transition-colors">
              Terms of Service
            </button>
            <button onClick={() => handleNav('contact')} className="hover:text-slate-300 transition-colors">
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
