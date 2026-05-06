'use client';

import { useState, useEffect } from 'react';
import { formatDistanceToNow, isPast } from 'date-fns';

export function Countdown({ targetDate }: { targetDate: string }) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    const updateCountdown = () => {
      const date = new Date(targetDate);
      if (isPast(date)) {
        setTimeLeft('Ready now!');
      } else {
        setTimeLeft(formatDistanceToNow(date, { addSuffix: true }));
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000); // update every minute

    return () => clearInterval(interval);
  }, [targetDate]);

  if (!mounted) return <span className="text-muted-foreground animate-pulse">Calculating...</span>;

  return <span className="font-semibold text-primary">{timeLeft}</span>;
}
