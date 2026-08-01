// src/hooks/useCountdown.js
import { useState, useEffect } from 'react';

const useCountdown = (expiresAt) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!expiresAt) return;

    const target = new Date(expiresAt).getTime();

    const tick = () => {
      const now = Date.now();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
        return;
      }

      setTimeLeft(diff);
    };

    tick(); // run immediately so there's no 1-second delay before first render
    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTime = () => {
    if (timeLeft === null) return '--:--:--';
    const totalSeconds = Math.floor(timeLeft / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return [hours, minutes, seconds].map((n) => String(n).padStart(2, '0')).join(':');
  };

  return { timeLeft, isExpired, formatted: formatTime() };
};

export default useCountdown;