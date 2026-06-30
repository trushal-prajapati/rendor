import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="glass-panel p-6 rounded-2xl border border-slate-100 flex flex-col justify-between h-40 animate-pulse">
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-2">
          {/* Label placeholder */}
          <div className="h-3 w-16 bg-slate-200/80 rounded-md"></div>
          {/* Value placeholder */}
          <div className="h-7 w-28 bg-slate-300/80 rounded-md"></div>
        </div>
        {/* Icon placeholder */}
        <div className="w-8 h-8 rounded-lg bg-slate-200/80"></div>
      </div>
      
      {/* Subtext placeholder */}
      <div className="h-3 w-40 bg-slate-200/80 rounded-md"></div>
    </div>
  );
};
