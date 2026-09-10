import { useEffectVisibility } from '../../../performance/useVisualEffects';
import { scheduleVisualMeasurement, cancelVisualMeasurement } from '../../../performance/frameTasks';
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
  const { active } = useEffectVisibility(backdropRef);
  useEffect(() => {
    const backdrop = backdropRef.current;
    if (!backdrop) return;

    backdrop.dataset.animationActive = String(active);
    if (!active || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let rect: DOMRect | null = null;
    let activeNodes: SVGElement[] = [];
    const invalidate = () => { rect = null; };
    const resize = new ResizeObserver(invalidate);
    resize.observe(backdrop);
    window.addEventListener('scroll', invalidate, { passive: true, capture: true });
    window.addEventListener('resize', invalidate, { passive: true });

    const clearActiveNodes = (): void => {
      activeNodes.forEach((node) => node.classList.remove('is-active'));
      activeNodes = [];
    };

    const resetPointer = (): void => {
      backdrop.style.setProperty('--ambient-pointer-x', '0px');
      backdrop.style.setProperty('--ambient-pointer-y', '0px');
      clearActiveNodes();
    };

    const updatePointer = (event: PointerEvent): void => {
      scheduleVisualMeasurement(backdrop, () => {
        rect ??= backdrop.getBoundingClientRect();
        const box = rect;
        return () => {
        const outside = event.clientX < box.left
          || event.clientX > box.right
          || event.clientY < box.top
          || event.clientY > box.bottom;

        if (outside) {
          resetPointer();
          return;
        }

        const normalizedX = Math.min(1, Math.max(0, (event.clientX - box.left) / box.width));
        const normalizedY = Math.min(1, Math.max(0, (event.clientY - box.top) / box.height));
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
        activeNodes = nextIndexes
          .map((index) => backdrop.querySelector<SVGElement>(`[data-ambient-node="${index}"]`))
          .filter((node): node is SVGElement => node !== null);
        activeNodes.forEach((node) => node.classList.add('is-active'));
        };
      });
    };

    window.addEventListener('pointermove', updatePointer, { passive: true });
    document.documentElement.addEventListener('pointerleave', resetPointer);

    return () => {
      resize.disconnect();
      window.removeEventListener('scroll', invalidate, true);
      window.removeEventListener('resize', invalidate);
      window.removeEventListener('pointermove', updatePointer);
      document.documentElement.removeEventListener('pointerleave', resetPointer);
      cancelVisualMeasurement(backdrop);
      resetPointer();
    };
  }, [active, activationRadius, activeLimit, points, shiftX, shiftY, viewBoxHeight, viewBoxWidth]);

  return backdropRef;
};

