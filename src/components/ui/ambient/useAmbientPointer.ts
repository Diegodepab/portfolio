import { useEffect, useRef, type RefObject } from 'react';

export interface AmbientPoint {
  x: number;
  y: number;
}

interface AmbientPointerOptions {
  points: readonly AmbientPoint[];
  viewBoxWidth: number;
  viewBoxHeight: number;
  activationRadius: number;
  activeLimit?: number;
  shiftX?: number;
  shiftY?: number;
}

export const findNearbyPointIndexes = (
  points: readonly AmbientPoint[],
  x: number,
  y: number,
  radius: number,
  limit = 1,
): number[] =>
  points
    .map((point, index) => ({ index, distance: Math.hypot(point.x - x, point.y - y) }))
    .filter(({ distance }) => distance <= radius)
    .sort((left, right) => left.distance - right.distance)
    .slice(0, Math.max(0, limit))
    .map(({ index }) => index);

export const useAmbientPointer = ({
  points,
  viewBoxWidth,
  viewBoxHeight,
  activationRadius,
  activeLimit = 1,
  shiftX = 6,
  shiftY = 4,
}: AmbientPointerOptions): RefObject<HTMLDivElement | null> => {
  const backdropRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<number | null>(null);
  const visibleRef = useRef(true);
  const activeNodesRef = useRef<SVGElement[]>([]);

  useEffect(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;

    const canInteract = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = typeof IntersectionObserver === 'undefined'
      ? null
      : new IntersectionObserver(
        ([entry]) => {
          visibleRef.current = entry?.isIntersecting ?? true;
        },
        { rootMargin: '80px' },
      );
    observer?.observe(backdrop);

    const clearActiveNodes = (): void => {
      activeNodesRef.current.forEach((node) => node.classList.remove('is-active'));
      activeNodesRef.current = [];
    };

    const resetPointer = (): void => {
      backdrop.style.setProperty('--ambient-pointer-x', '0px');
      backdrop.style.setProperty('--ambient-pointer-y', '0px');
      clearActiveNodes();
    };

    if (!canInteract || reduceMotion) {
      return () => observer?.disconnect();
    }

    const updatePointer = (event: PointerEvent): void => {
      if (!visibleRef.current) return;
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);

      frameRef.current = window.requestAnimationFrame(() => {
        frameRef.current = null;
        const rect = backdrop.getBoundingClientRect();
        const outside = event.clientX < rect.left
          || event.clientX > rect.right
          || event.clientY < rect.top
          || event.clientY > rect.bottom;

        if (outside) {
          resetPointer();
          return;
        }

        const normalizedX = Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width));
        const normalizedY = Math.min(1, Math.max(0, (event.clientY - rect.top) / rect.height));
        backdrop.style.setProperty(
          '--ambient-pointer-x',
          `${(normalizedX - 0.5) * shiftX * 2}px`,
        );
        backdrop.style.setProperty(
          '--ambient-pointer-y',
          `${(normalizedY - 0.5) * shiftY * 2}px`,
        );

        const nextIndexes = findNearbyPointIndexes(
          points,
          normalizedX * viewBoxWidth,
          normalizedY * viewBoxHeight,
          activationRadius,
          activeLimit,
        );

        clearActiveNodes();
        activeNodesRef.current = nextIndexes
          .map((index) => backdrop.querySelector<SVGElement>(`[data-ambient-node="${index}"]`))
          .filter((node): node is SVGElement => node !== null);
        activeNodesRef.current.forEach((node) => node.classList.add('is-active'));
      });
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', resetPointer);

    return () => {
      observer?.disconnect();
      window.removeEventListener('pointermove', updatePointer);
      document.documentElement.removeEventListener('pointerleave', resetPointer);
      if (frameRef.current !== null) window.cancelAnimationFrame(frameRef.current);
      resetPointer();
    };
  }, [activationRadius, activeLimit, points, shiftX, shiftY, viewBoxHeight, viewBoxWidth]);

  return backdropRef;
};

