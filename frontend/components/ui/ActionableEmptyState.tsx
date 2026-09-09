'use client';

import React from 'react';
import { LucideIcon, Search, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ActionableEmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  secondaryActionLabel?: string;
  onSecondaryAction?: () => void;
  className?: string;
}

export const ActionableEmptyState: React.FC<ActionableEmptyStateProps> = ({
  icon: Icon = Search,
  title,
  description,
  actionLabel,
  onAction,
  secondaryActionLabel,
  onSecondaryAction,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border-subtle bg-surface-card p-10 text-center space-y-4 shadow-sm flex flex-col items-center justify-center max-w-xl mx-auto my-6',
        className,
      )}
    >
      <div className="p-4 rounded-2xl bg-surface-subtle border border-border-subtle text-slate-400 shadow-inner">
        <Icon className="w-8 h-8 text-cyan-400/80" />
      </div>

      <div className="space-y-1.5 max-w-md">
        <h3 className="text-base font-bold text-white tracking-tight">{title}</h3>
        <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
      </div>

      {(actionLabel || secondaryActionLabel) && (
        <div className="flex items-center gap-3 pt-2">
          {secondaryActionLabel && onSecondaryAction && (
            <button
              onClick={onSecondaryAction}
              className="px-4 py-2 rounded-xl border border-border-subtle bg-surface-subtle hover:bg-surface-hover text-slate-300 text-xs font-semibold transition-all"
            >
              {secondaryActionLabel}
            </button>
          )}

          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md shadow-blue-500/20 active:scale-95"
            >
              {actionLabel}
            </button>
          )}
        </div>
      )}
    </div>
  );
};
