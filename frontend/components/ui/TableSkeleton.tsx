'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface TableSkeletonProps {
  rows?: number;
  cols?: number;
  showHeader?: boolean;
  className?: string;
}

export const TableSkeleton: React.FC<TableSkeletonProps> = ({
  rows = 6,
  cols = 5,
  showHeader = true,
  className,
}) => {
  return (
    <div
      className={cn(
        'rounded-2xl border border-border-subtle bg-surface-card overflow-hidden shadow-sm',
        className,
      )}
    >
      {/* Header Skeleton */}
      {showHeader && (
        <div className="p-4 border-b border-border-subtle bg-surface-subtle/50 flex items-center justify-between">
          <div className="h-4 w-44 bg-slate-800/80 rounded animate-pulse" />
          <div className="flex items-center gap-2">
            <div className="h-8 w-24 bg-slate-800/70 rounded-xl animate-pulse" />
            <div className="h-8 w-8 bg-slate-800/70 rounded-xl animate-pulse" />
          </div>
        </div>
      )}

      {/* Rows Skeleton */}
      <div className="divide-y divide-border-subtle/60">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div
            key={rIdx}
            className="p-4 flex items-center justify-between gap-4 animate-pulse"
          >
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div
                key={cIdx}
                className="h-3.5 bg-slate-800/70 rounded"
                style={{
                  width:
                    cIdx === 0
                      ? '28%'
                      : cIdx === cols - 1
                      ? '14%'
                      : `${Math.max(12, Math.floor(60 / cols))}%`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
