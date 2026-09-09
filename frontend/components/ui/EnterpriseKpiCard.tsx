'use client';

import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

export type KpiVariant = 'blue' | 'emerald' | 'amber' | 'cyan' | 'rose' | 'purple';

interface EnterpriseKpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: KpiVariant;
  trend?: {
    value: number; // Ej: +12.5 o -3.2
    label: string; // Ej: "vs mes anterior"
  };
  badgeText?: string;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

const variantStyles: Record<
  KpiVariant,
  { iconBg: string; hoverBorder: string; valueText: string; pulseColor: string }
> = {
  blue: {
    iconBg: 'bg-blue-500/10 border-blue-500/25 text-blue-400',
    hoverBorder: 'hover:border-blue-500/50 hover:shadow-blue-500/5',
    valueText: 'text-blue-400',
    pulseColor: 'bg-blue-400',
  },
  emerald: {
    iconBg: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
    hoverBorder: 'hover:border-emerald-500/50 hover:shadow-emerald-500/5',
    valueText: 'text-[#00F2C3]',
    pulseColor: 'bg-[#00F2C3]',
  },
  amber: {
    iconBg: 'bg-amber-500/10 border-amber-500/25 text-amber-400',
    hoverBorder: 'hover:border-amber-500/50 hover:shadow-amber-500/5',
    valueText: 'text-amber-400',
    pulseColor: 'bg-amber-400',
  },
  cyan: {
    iconBg: 'bg-cyan-500/10 border-cyan-500/25 text-cyan-400',
    hoverBorder: 'hover:border-cyan-500/50 hover:shadow-cyan-500/5',
    valueText: 'text-cyan-400',
    pulseColor: 'bg-cyan-400',
  },
  rose: {
    iconBg: 'bg-rose-500/10 border-rose-500/25 text-rose-400',
    hoverBorder: 'hover:border-rose-500/50 hover:shadow-rose-500/5',
    valueText: 'text-rose-400',
    pulseColor: 'bg-rose-400',
  },
  purple: {
    iconBg: 'bg-purple-500/10 border-purple-500/25 text-purple-400',
    hoverBorder: 'hover:border-purple-500/50 hover:shadow-purple-500/5',
    valueText: 'text-purple-400',
    pulseColor: 'bg-purple-400',
  },
};

export const EnterpriseKpiCard: React.FC<EnterpriseKpiCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'blue',
  trend,
  badgeText,
  loading = false,
  onClick,
  className,
}) => {
  const styles = variantStyles[variant];

  if (loading) {
    return (
      <div
        className={cn(
          'rounded-2xl p-5 border border-border-subtle bg-surface-card space-y-3 animate-pulse',
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <div className="h-3 w-28 bg-slate-800 rounded-md" />
          <div className="h-8 w-8 bg-slate-800 rounded-xl" />
        </div>
        <div className="h-7 w-36 bg-slate-800 rounded-md" />
        <div className="h-2.5 w-24 bg-slate-800/60 rounded-md" />
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        'rounded-2xl p-5 border border-border-subtle bg-surface-card space-y-3 transition-all duration-200',
        styles.hoverBorder,
        onClick ? 'cursor-pointer active:scale-[0.99]' : '',
        'shadow-sm hover:shadow-xl hover:shadow-black/40',
        className,
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase font-mono">
          {title}
        </span>
        <div className="flex items-center gap-1.5">
          {badgeText && (
            <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700/50 uppercase">
              {badgeText}
            </span>
          )}
          <div className={cn('p-2 rounded-xl border', styles.iconBg)}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </div>

      <div className="flex items-baseline gap-2.5">
        <p className={cn('text-2xl font-black font-mono tracking-tight', styles.valueText)}>
          {value}
        </p>
        {trend && (
          <span
            className={cn(
              'inline-flex items-center gap-0.5 text-[11px] font-mono font-bold px-1.5 py-0.5 rounded-md border',
              trend.value > 0
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                : trend.value < 0
                ? 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                : 'bg-slate-500/10 text-slate-400 border-slate-500/20',
            )}
          >
            {trend.value > 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : trend.value < 0 ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            {Math.abs(trend.value)}%
          </span>
        )}
      </div>

      {(subtitle || trend?.label) && (
        <p className="text-[11px] text-slate-400 font-sans truncate">
          {trend?.label ? (
            <span className="text-slate-500">{trend.label} • </span>
          ) : null}
          {subtitle}
        </p>
      )}
    </div>
  );
};
