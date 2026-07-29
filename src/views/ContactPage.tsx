'use client';

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, CheckCircle2 } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-[#0d151c] text-white py-16 px-4 sm:px-8 lg:px-12 space-y-16 animate-in fade-in duration-300">
      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="bg-[#2563eb]/20 text-[#3b82f6] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
            Get In Touch
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight">
            Connect With Our Global Advisors
          </h1>
          <p className="text-slate-400 text-base sm:text-lg leading-relaxed">
            Have a project in mind, need custom IT solutions, or looking for strategic financial advisory? We are here to answer your inquiries.
          </p>
        </div>

        {/* Contact Info & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-8 bg-[#131e28] border border-white/10 p-8 rounded-3xl shadow-xl">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Optibiz Global Headquarters</h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                Our team operates across North America, Europe, and Asia Pacific to provide 24/7 IT support and strategic consulting.
              </p>
            </div>

            <div className="space-y-6 pt-2">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Office Location</h4>
                  <p className="text-xs text-slate-300">124 Financial Plaza, Wall Street, New York, NY 10005</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Direct Phone Lines</h4>
                  <p className="text-xs text-slate-300">+91 9635301453</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Email Addresses</h4>
                  <p className="text-xs text-slate-300">alphalaayers@gmail.com</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 font-bold">
                  <Clock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Business Hours</h4>
                  <p className="text-xs text-slate-300">Monday - Friday: 8:00 AM - 7:00 PM EST</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-7 bg-[#131e28] border border-white/10 p-8 rounded-3xl shadow-xl">
            {!submitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h3 className="text-2xl font-bold text-white">Send Us A Message</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-[#182531] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="w-full bg-[#182531] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2563eb]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Inquiry Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. In-House SaaS Demo / Custom IT Development"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full bg-[#182531] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2563eb]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Detailed Message</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="Describe your project scope, requirements, or timeline..."
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full bg-[#182531] border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#2563eb]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#2563eb] text-white font-bold py-4 rounded-full flex items-center justify-center gap-2 hover:bg-[#1d4ed8] transition-all cursor-pointer shadow-lg text-sm"
                >
                  <span>Send Message Now</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-[#2563eb] text-white flex items-center justify-center mx-auto shadow-xl">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white">Message Delivered!</h3>
                <p className="text-xs text-slate-300 max-w-sm mx-auto">
                  Thank you, <span className="text-[#3b82f6] font-semibold">{form.name}</span>. An Optibiz executive consultant will respond to your message shortly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 bg-white/10 hover:bg-white/20 text-white font-semibold px-6 py-2 rounded-full text-xs"
                >
                  Send Another Inquiry
                </button>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
