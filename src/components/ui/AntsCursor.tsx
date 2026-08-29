import React, { useEffect, useRef } from 'react';
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

  useEffect(() => {
    let cursor: ReturnType<typeof antsCursor> | undefined;
    let previousColor = '';

    const resolveColor = (): string => {
      if (!color.startsWith('var(')) return color;
      const varName = color.slice(4, -1).trim();
      return getComputedStyle(document.documentElement).getPropertyValue(varName).trim() || '#ffffff';
    };

    const createCursor = (): void => {
      const resolvedColor = resolveColor();
      if (cursor && resolvedColor === previousColor) return;
      cursor?.destroy();
      previousColor = resolvedColor;
      cursor = antsCursor({
        element: containerRef.current,
        color: resolvedColor,
        numberOfAnts,
        speed,
        zIndex,
        opacity,
        sizeMultiplier,
      });
    };

    createCursor();
    const paletteObserver = color.startsWith('var(')
      ? new MutationObserver(createCursor)
      : null;
    paletteObserver?.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

    return () => {
      paletteObserver?.disconnect();
      cursor?.destroy();
    };
  }, [color, numberOfAnts, speed, zIndex, opacity, sizeMultiplier]);

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
