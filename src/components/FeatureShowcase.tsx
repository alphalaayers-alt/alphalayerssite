import React from 'react';
import { ArrowRight, Settings, Compass, DollarSign } from 'lucide-react';

interface FeatureShowcaseProps {
  onOpenVideo: () => void;
  onSelectService: (service: string) => void;
}

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({ onOpenVideo, onSelectService }) => {
  const thumbImage = '/src/assets/images/how_it_works_thumb_1785300372810.jpg';

  const consultingFeatures = [
    {
      id: 'operational',
      icon: Settings,
      title: 'Operational Consulting',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Ut.',
    },
    {
      id: 'strategy',
      icon: Compass,
      title: 'Strategy Consulting',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Ut.',
    },
    {
      id: 'financial',
      icon: DollarSign,
      title: 'Financial Consulting',
      desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit Ut.',
    },
  ];

  return (
    <section className="bg-[#0d151c] text-white pb-16 px-4 sm:px-8 lg:px-12">
      <div className="max-w-[1500px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Left Media Card: "How Does It Work?" */}
        <div 
          onClick={onOpenVideo}
          className="lg:col-span-4 relative rounded-3xl overflow-hidden min-h-[220px] lg:min-h-full cursor-pointer group shadow-xl border border-white/10"
        >
          <img
            src={thumbImage}
            alt="How Does It Work?"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover min-h-[240px] group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-6 flex flex-col justify-end">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
              How Does It Work?
            </h3>
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#3b82f6] group-hover:underline">
              <span>Learn More</span>
              <div className="w-5 h-5 rounded-full bg-[#2563eb] text-white flex items-center justify-center">
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Pillars Box: Operational, Strategy, Financial Consulting */}
        <div className="lg:col-span-8 bg-[#131e28] border border-white/10 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8 items-center shadow-xl">
          {consultingFeatures.map((item) => {
            const IconComponent = item.icon;
            return (
              <div
                key={item.id}
                onClick={() => onSelectService(item.id)}
                className="flex flex-col items-start gap-3 group cursor-pointer hover:bg-white/5 p-4 rounded-2xl transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-[#2563eb] text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                  <IconComponent className="w-6 h-6 stroke-[2.2]" />
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-[#3b82f6] transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
