import React from 'react';
import { Target, Compass, CheckCircle2, ArrowRight } from 'lucide-react';

interface AboutUsProps {
  onLearnMore: () => void;
}

export const AboutUs: React.FC<AboutUsProps> = ({ onLearnMore }) => {
  const teamImage = '/src/assets/images/about_us_team_1785300385474.jpg';

  return (
    <section id="about" className="bg-white text-slate-900 py-20 px-4 sm:px-8 lg:px-12">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: Image + Company Vission */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          
          {/* Main Photo Card */}
          <div className="rounded-3xl overflow-hidden shadow-lg border border-slate-100">
            <img
              src={teamImage}
              alt="Finance Consulting Team"
              referrerPolicy="no-referrer"
              className="w-full h-80 sm:h-96 object-cover hover:scale-103 transition-transform duration-500"
            />
          </div>

          {/* Company Vission Block */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
              <Target className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Company Vision
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                To empower enterprise organizations with high-performing software technology and reliable financial advisory that accelerates operational scaling.
              </p>
            </div>
          </div>

        </div>

        {/* Right Column: About Us Title + Company Mission + Dark Callout Banner */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          
          {/* Header */}
          <div className="flex flex-col items-start gap-4">
            <span className="bg-[#2563eb]/10 text-[#2563eb] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider">
              About Us
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              The Premier IT Services & Technology Agency
            </h2>
          </div>

          {/* Company Mission Block */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-[#2563eb] text-white flex items-center justify-center flex-shrink-0 shadow-sm mt-1">
              <Compass className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                Company Mission
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Delivering customer-first software platforms and financial models that streamline complexity and protect multi-million dollar portfolios.
              </p>
            </div>
          </div>

          {/* Dark Navy Banner CTA Box */}
          <div className="bg-[#131e28] text-white p-5 sm:p-6 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl border border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2563eb]/20 text-[#3b82f6] flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm text-slate-200 font-medium leading-snug">
                Join us to achieve sustainable growth and reach your financial goals with the right strategies.
              </p>
            </div>

            <button
              onClick={onLearnMore}
              className="bg-[#2563eb] text-white font-bold px-5 py-2.5 rounded-full flex items-center gap-2 hover:bg-[#1d4ed8] transition-all flex-shrink-0 text-xs sm:text-sm cursor-pointer shadow-md hover:scale-105"
            >
              <span>Learn More</span>
              <div className="w-5 h-5 rounded-full bg-white text-[#2563eb] flex items-center justify-center">
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          </div>

        </div>

      </div>
    </section>
  );
};
