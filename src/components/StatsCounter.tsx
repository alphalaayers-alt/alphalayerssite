import React from 'react';

export const StatsCounter: React.FC = () => {
  const stats = [
    {
      id: 'stat-1',
      number: '25',
      symbol: '+',
      label: 'A legacy of expertise spanning 24+ years.',
    },
    {
      id: 'stat-2',
      number: '150K',
      symbol: '+',
      label: 'Where ideas flourish and projects thrive.',
    },
    {
      id: 'stat-3',
      number: '98',
      symbol: '%',
      label: 'Striving for customer satisfaction is top priority.',
    },
    {
      id: 'stat-4',
      number: '$40M',
      symbol: '+',
      label: 'This is our pure benefit to our clients',
    },
  ];

  return (
    <section className="bg-white py-12 px-4 sm:px-8 lg:px-12 border-t border-b border-slate-100">
      <div className="max-w-[1500px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((stat) => (
          <div key={stat.id} className="flex flex-col items-start gap-2 group">
            {/* Top Blue Accent Line */}
            <div className="h-1.5 w-14 bg-[#2563eb] rounded-full group-hover:w-20 transition-all duration-300" />
            
            {/* Number with Symbol */}
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
                {stat.number}
              </span>
              <span className="text-3xl sm:text-4xl font-light text-[#2563eb]">
                {stat.symbol}
              </span>
            </div>

            {/* Label */}
            <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed max-w-[200px]">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};
