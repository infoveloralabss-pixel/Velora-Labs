import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  className = ''
}) => {
  const iconDimensions = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11',
    xl: 'w-14 h-14',
  }[size];

  const textSize = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
  }[size];

  const subTextSize = {
    sm: 'text-[9px]',
    md: 'text-[10px]',
    lg: 'text-[11px]',
    xl: 'text-xs',
  }[size];

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* 4-Pillars Integrated Agency Emblem (Web, AI Automation, SaaS Production, Marketing) */}
      <div
        className={`relative ${iconDimensions} rounded-xl p-[1.5px] bg-gradient-to-br from-cyan-400 via-indigo-500 to-amber-500 shadow-lg shadow-cyan-500/20 shrink-0 group-hover:shadow-cyan-400/35 group-hover:scale-105 transition-all duration-300`}
      >
        <div className="w-full h-full rounded-[10px] bg-[#050711] flex items-center justify-center overflow-hidden relative">
          <img
            src="/velora-logo.jpg"
            alt="Velora Labs Agency Emblem"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center rounded-[9px]"
          />
        </div>
      </div>

      {/* Brand Typography */}
      {showText && (
        <div className="leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-display font-bold tracking-tight text-white ${textSize} group-hover:text-cyan-200 transition-colors`}
            >
              Velora
            </span>
            <span
              className={`font-display font-semibold tracking-wider bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent ${textSize}`}
            >
              Labs
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
          </div>
          <p
            className={`font-mono text-slate-400 tracking-wider uppercase font-medium ${subTextSize}`}
          >
            Digital Systems & AI
          </p>
        </div>
      )}
    </div>
  );
};

