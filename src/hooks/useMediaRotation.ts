import { useCallback, useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export const useMediaRotation = (
  itemCount: number,
  interval: number,
  initialIndex = 0,
  initialDelay = interval,
  paused = false,
) => {
  const [activeIndex, setActiveIndexState] = useState(initialIndex);
  const [scheduleRevision, setScheduleRevision] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const setActiveIndex = useCallback((index: number) => {
    setActiveIndexState(index);
    setScheduleRevision((revision) => revision + 1);
  }, []);

  useEffect(() => {
    if (itemCount < 2 || shouldReduceMotion || paused) return;

    let initialTimer: number | undefined;
    let rotationTimer: number | undefined;

    const stopTimer = () => {
      if (initialTimer !== undefined) window.clearTimeout(initialTimer);
      if (rotationTimer !== undefined) window.clearInterval(rotationTimer);
      initialTimer = undefined;
      rotationTimer = undefined;
    };

    const startTimer = () => {
      stopTimer();
      if (!document.hidden) {
        initialTimer = window.setTimeout(() => {
          setActiveIndexState((current) => (current + 1) % itemCount);
          rotationTimer = window.setInterval(() => {
            setActiveIndexState((current) => (current + 1) % itemCount);
          }, interval);
        }, initialDelay);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) stopTimer();
      else startTimer();
    };

    startTimer();
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      stopTimer();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [initialDelay, interval, itemCount, paused, scheduleRevision, shouldReduceMotion]);

  return { activeIndex, setActiveIndex, shouldReduceMotion: Boolean(shouldReduceMotion) };
};
