import React from 'react';

interface MonettLogoProps {
  className?: string;
  size?: number;
}

export const MonettLogo: React.FC<MonettLogoProps> = ({ className = 'h-9 w-auto', size = 130 }) => {
  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* Frog Mascot Icon */}
      <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center shadow-sm shrink-0 border border-emerald-600/30 overflow-hidden">
        <span className="text-lg leading-none" role="img" aria-label="Monett Frog">
          🐸
        </span>
      </div>
      {/* Monett Wordmark */}
      <div className="flex flex-col">
        <span className="text-xl font-black tracking-tight text-emerald-800 leading-none">
          Monett<span className="text-amber-500">.</span>
        </span>
        <span className="text-[8px] font-bold uppercase tracking-wider text-emerald-600/80 -mt-0.5">
          Money Moments
        </span>
      </div>
    </div>
  );
};
