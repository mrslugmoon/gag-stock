import { useState, useEffect } from "react";

export function useCountdown(targetTimestamp: number | null) {
  const [countdown, setCountdown] = useState<string>("");

  useEffect(() => {
    if (!targetTimestamp || targetTimestamp <= 0) {
      setCountdown("");
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const timeLeft = targetTimestamp - now;

      if (timeLeft <= 0) {
        setCountdown("00:00");
        return;
      }

      const minutes = Math.floor(timeLeft / (1000 * 60));
      const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

      setCountdown(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [targetTimestamp]);

  return countdown;
}
