import React from 'react';

type Variant = 'compact' | 'detailed';

interface PriorityScoreBadgeProps {
  score?: number | null;
  variant?: Variant;
  className?: string;
}

export const tierFor = (score: number) => {
  if (score >= 0.75) return { label: 'Critical', bar: 'bg-red-500',    chip: 'bg-red-100 text-red-700' };
  if (score >= 0.50) return { label: 'High',     bar: 'bg-orange-500', chip: 'bg-orange-100 text-orange-700' };
  if (score >= 0.25) return { label: 'Medium',   bar: 'bg-yellow-500', chip: 'bg-yellow-100 text-yellow-700' };
  return                    { label: 'Low',      bar: 'bg-green-500',  chip: 'bg-green-100 text-green-700' };
};

export const PriorityScoreBadge: React.FC<PriorityScoreBadgeProps> = ({
  score,
  variant = 'compact',
  className = '',
}) => {
  if (score === undefined || score === null || Number.isNaN(score)) {
    return <span className={`text-xs text-gray-400 ${className}`}>—</span>;
  }

  const clamped = Math.max(0, Math.min(1, score));
  const pct = Math.round(clamped * 100);
  const tier = tierFor(clamped);

  if (variant === 'compact') {
    return (
      <div className={`flex items-center gap-2 ${className}`} title={`Priority score: ${pct}% (${tier.label})`}>
        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className={`${tier.bar} h-full rounded-full`} style={{ width: `${pct}%` }} />
        </div>
        <span className="text-xs font-medium text-gray-700 tabular-nums">{pct}%</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${tier.chip}`}>
          {tier.label} · {pct}%
        </span>
      </div>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div className={`${tier.bar} h-full rounded-full transition-[width] duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
};

export default PriorityScoreBadge;
