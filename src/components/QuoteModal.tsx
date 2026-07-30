'use client';

import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, ArrowRight } from 'lucide-react';
import { submitForm } from '../lib/submit-form';
import { useSiteContent } from './SiteContentProvider';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultService?: string;
}

export const QuoteModal: React.FC<QuoteModalProps> = ({ isOpen, onClose, defaultService = 'Financial Consulting' }) => {
  const { content } = useSiteContent();
  const quote = content.modals.quote;
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    service: defaultService,
    message: '',
  });

  useEffect(() => {
    setFormData((prev) => ({ ...prev, service: defaultService }));
  }, [defaultService]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError('');

    const result = await submitForm('quote', formData);

    setSubmitting(false);
    if (result.success) {
      setSubmitted(true);
    } else {
      setSubmitError(result.error || 'Failed to submit. Please try again.');
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#131e28] border border-white/10 rounded-3xl p-6 sm:p-8 max-w-lg w-full text-white relative shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white bg-white/5 p-2 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <div className="space-y-6">
            <div>
              <div className="inline-block bg-[#2563eb] text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                {quote.badge}
              </div>
              <h3 className="text-2xl font-bold text-white">{quote.title}</h3>
              <p className="text-xs text-slate-400 mt-1">{quote.subtitle}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-[#182531] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-[#182531] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-[#182531] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2563eb]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Select Service</label>
                <select
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  className="w-full bg-[#182531] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#2563eb]"
                >
                  {quote.serviceOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Project Details</label>
                <textarea
                  rows={3}
                  placeholder="Tell us about your business goals or financial challenges..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-[#182531] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#2563eb] text-white font-bold py-3.5 rounded-full flex items-center justify-center gap-2 hover:bg-[#1d4ed8] transition-all cursor-pointer shadow-lg disabled:opacity-60"
              >
                <span>{submitting ? 'Submitting...' : quote.submitLabel}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              {submitError && <p className="text-xs text-red-400 text-center">{submitError}</p>}
            </form>
          </div>
        ) : (
          <div className="py-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#2563eb] text-white flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-white">{quote.successTitle}</h3>
            <p className="text-xs text-slate-300 max-w-sm mx-auto">
              {quote.successBody}{' '}
              <span className="text-[#3b82f6] font-semibold">{formData.fullName || 'Valued Client'}</span>
            </p>
            <button
              onClick={handleReset}
              className="mt-4 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2.5 rounded-full text-xs transition-colors"
            >
              Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
