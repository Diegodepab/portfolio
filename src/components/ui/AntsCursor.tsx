import React, { useEffect, useRef } from 'react';
import { useEffectVisibility } from '../../performance/useVisualEffects';
import { scheduleVisualMeasurement, cancelVisualMeasurement } from '../../performance/frameTasks';
import { antsCursor } from '../../utils/antsCursor';

interface AntsCursorProps {
  color?: string;
  numberOfAnts?: number;
  speed?: number;
  zIndex?: string;
  opacity?: number;
  sizeMultiplier?: number;
}

export const AntsCursor: React.FC<AntsCursorProps> = ({
  color = 'var(--color-accent-3)',
  numberOfAnts = 20,
  speed = 1.2,
  zIndex = '0',
  opacity = 0.4,
  sizeMultiplier = 0.7
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { active } = useEffectVisibility(containerRef);

  useEffect(() => {
    if (!active) return;
    const measurementKey = {};
    const container = containerRef.current;
    let cursor: ReturnType<typeof antsCursor> | undefined;
    let previousColor = '';

    const resolveColor = (): string => {
      if (!color.startsWith('var(')) return color;
      const varName = color.slice(4, -1).trim();
      return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#ffffff';
    };

    const syncCursor = (): void => {
      scheduleVisualMeasurement(measurementKey, () => {
        const resolvedColor = resolveColor();
        const initialSize = container ? { width: container.clientWidth, height: container.clientHeight } : undefined;
        return () => {
          if (cursor && resolvedColor === previousColor) return;
          previousColor = resolvedColor;
          if (cursor) {
            cursor.updateColor(resolvedColor);
            return;
          }
          cursor = antsCursor({ element: container, initialSize, color: resolvedColor,
            numberOfAnts, speed, zIndex, opacity, sizeMultiplier });
        };
      });
    };

    syncCursor();
    const paletteObserver = color.startsWith('var(')
      ? new MutationObserver(syncCursor)
      : null;
    paletteObserver?.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

    return () => {
      cancelVisualMeasurement(measurementKey);
      paletteObserver?.disconnect();
      cursor?.destroy();
    };
  }, [active, color, numberOfAnts, speed, zIndex, opacity, sizeMultiplier]);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex,
      }}
      aria-hidden="true"
    />
  );
};
