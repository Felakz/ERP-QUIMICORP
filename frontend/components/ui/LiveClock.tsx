'use client';

import React, { useState, useEffect } from 'react';

export function LiveClock({ className = '' }: { className?: string }) {
  const [timeString, setTimeString] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(
        now.toLocaleDateString('es-ES', {
          weekday: 'short',
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }) +
        ' ' +
        now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return <span className={className}>{timeString}</span>;
}
