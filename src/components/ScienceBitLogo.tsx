import React from 'react';

interface ScienceBitLogoProps {
  variant?: 'light' | 'dark' | 'badge';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showLink?: boolean;
  className?: string;
}

export const ScienceBitLogo: React.FC<ScienceBitLogoProps> = ({
  variant = 'badge',
  size = 'sm',
  showLink = true,
  className = '',
}) => {
  const isLightText = variant === 'light';

  const badgeContent = (
    <div
      className={`inline-flex items-center gap-1.5 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-blue-500/50 px-2.5 py-1 rounded-xl shadow-inner transition select-none group ${className}`}
      title="ScienceBit Computer - sciencebit.com.br"
    >
      {/* Brand Icon / Symbol */}
      <span className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(0,98,255,0.6)] group-hover:scale-110 transition shrink-0" />

      {/* Wordmark: Science (White) + Bit (Blue) */}
      <div className="flex items-baseline gap-0.5 leading-none font-black tracking-tight text-xs sm:text-[13px]">
        <span className={isLightText ? 'text-white' : 'text-slate-100 group-hover:text-white transition'}>
          Science
        </span>
        <span className="text-[#0062FF] group-hover:text-blue-400 transition">
          Bit
        </span>
      </div>

      {/* Subtitle Separator */}
      <span className="text-slate-600 text-[10px] font-mono leading-none">•</span>

      {/* Corporate Tag */}
      <span className="text-[10px] font-bold tracking-wider text-slate-400 group-hover:text-slate-300 uppercase leading-none">
        Computer
      </span>
    </div>
  );

  const flatContent = (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <div className="flex items-baseline gap-0.5 font-black tracking-tight text-sm sm:text-base leading-none">
        <span className={isLightText ? 'text-white' : 'text-slate-100'}>Science</span>
        <span className="text-[#0062FF]">Bit</span>
      </div>
      <div className="flex items-center gap-1 mt-0.5">
        <span className="w-3 h-0.5 bg-[#0062FF] rounded-full" />
        <span className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase leading-none">
          Computer
        </span>
        <span className="w-3 h-0.5 bg-[#0062FF] rounded-full" />
      </div>
    </div>
  );

  const rendered = variant === 'badge' ? badgeContent : flatContent;

  if (showLink) {
    return (
      <a
        href="https://sciencebit.com.br"
        target="_blank"
        rel="noopener noreferrer"
        title="ScienceBit Computer (sciencebit.com.br)"
        className="inline-flex items-center focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-xl shrink-0"
      >
        {rendered}
      </a>
    );
  }

  return rendered;
};
