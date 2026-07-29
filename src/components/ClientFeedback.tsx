import React from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { testimonialsData } from '../data/mockData';

export const ClientFeedback: React.FC = () => {
  return (
    <section className="bg-[#0b1218] text-white py-20 px-4 sm:px-8 lg:px-12 border-t border-white/5">
      <div className="max-w-[1500px] mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="bg-[#2563eb]/20 text-[#3b82f6] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider inline-block">
            Client Feedback
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Trusted By Global Technology & Finance Leaders
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            See how Optibiz IT services and strategic consulting empower executive leaders to transform their organizational trajectory.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonialsData.map((item) => (
            <div
              key={item.id}
              className="bg-[#131e28] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col justify-between space-y-6 relative group hover:border-[#2563eb]/50 transition-all duration-300 shadow-xl"
            >
              <Quote className="w-10 h-10 text-[#2563eb]/20 absolute top-6 right-6" />

              <div className="space-y-4 relative z-10">
                {/* Rating Stars */}
                <div className="flex text-[#2563eb]">
                  {[...Array(item.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#2563eb] text-[#2563eb]" />
                  ))}
                </div>

                {/* Content */}
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed italic">
                  "{item.content}"
                </p>
              </div>

              {/* Author Card */}
              <div className="flex items-center gap-3.5 pt-4 border-t border-white/10 relative z-10">
                <img
                  src={item.avatar}
                  alt={item.name}
                  referrerPolicy="no-referrer"
                  className="w-11 h-11 rounded-full object-cover border-2 border-[#2563eb]"
                />
                <div>
                  <h4 className="text-sm font-bold text-white group-hover:text-[#3b82f6] transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {item.role}, <span className="text-slate-300 font-semibold">{item.company}</span>
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
